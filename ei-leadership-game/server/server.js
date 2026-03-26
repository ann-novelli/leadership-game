const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const GameManager = require('./gameManager');
const ScenarioEngine = require('./scenarioEngine');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Initialize game manager and scenario engine
const gameManager = new GameManager();
const scenarioEngine = new ScenarioEngine();

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`New player connected: ${socket.id}`);

  // Create new game room
  socket.on('createRoom', (playerName) => {
    const room = gameManager.createRoom(socket.id, playerName);
    socket.join(room.code);
    socket.emit('roomCreated', {
      roomCode: room.code,
      playerId: socket.id,
      playerName: playerName
    });
    console.log(`Room created: ${room.code} by ${playerName}`);
  });

  // Join existing room
  socket.on('joinRoom', ({ roomCode, playerName }) => {
    const result = gameManager.joinRoom(roomCode, socket.id, playerName);
    
    if (result.success) {
      socket.join(roomCode);
      socket.emit('roomJoined', {
        roomCode: roomCode,
        playerId: socket.id,
        playerName: playerName
      });
      
      // Notify all players in room
      io.to(roomCode).emit('playerJoined', {
        players: result.room.players,
        newPlayer: playerName
      });
      
      console.log(`${playerName} joined room: ${roomCode}`);
    } else {
      socket.emit('joinError', { message: result.message });
    }
  });

  // Start game
  socket.on('startGame', (roomCode) => {
    const room = gameManager.getRoom(roomCode);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.host !== socket.id) {
      socket.emit('error', { message: 'Only host can start the game' });
      return;
    }

    if (room.players.length < 3) {
      socket.emit('error', { message: 'Need at least 3 players to start' });
      return;
    }

    // Initialize game
    room.gameState = 'introduction';
    room.scenarios = scenarioEngine.getScenarios();
    room.currentScenarioIndex = 0;

    io.to(roomCode).emit('gameStarted', {
      totalScenarios: room.scenarios.length
    });

    console.log(`Game started in room: ${roomCode}`);
  });

  // Player ready (after introduction)
  socket.on('playerReady', (roomCode) => {
    const room = gameManager.getRoom(roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.ready = true;
    }

    // Check if all players are ready
    const allReady = room.players.every(p => p.ready);
    
    io.to(roomCode).emit('playersReadyUpdate', {
      readyCount: room.players.filter(p => p.ready).length,
      totalPlayers: room.players.length
    });

    if (allReady) {
      // Start first scenario
      startScenario(room, roomCode);
    }
  });

  // Submit response
  socket.on('submitResponse', ({ roomCode, scenarioId, optionId }) => {
    const room = gameManager.getRoom(roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    // Record response
    if (!room.responses) room.responses = {};
    if (!room.responses[scenarioId]) room.responses[scenarioId] = {};
    
    room.responses[scenarioId][socket.id] = {
      playerId: socket.id,
      playerName: player.name,
      optionId: optionId,
      timestamp: Date.now()
    };

    // Update player score
    const scenario = room.scenarios[room.currentScenarioIndex];
    const option = scenario.options.find(opt => opt.id === optionId);
    
    if (option && option.scores) {
      if (!player.scores) {
        player.scores = {
          selfAwareness: 0,
          selfRegulation: 0,
          motivation: 0,
          empathy: 0,
          socialSkills: 0
        };
      }
      
      // Add scores from this response
      Object.keys(option.scores).forEach(component => {
        player.scores[component] += option.scores[component];
      });
    }

    // Notify room of response count
    const responseCount = Object.keys(room.responses[scenarioId]).length;
    io.to(roomCode).emit('responseReceived', {
      responseCount: responseCount,
      totalPlayers: room.players.length
    });

    // Check if all players have responded
    if (responseCount === room.players.length) {
      showScenarioResults(room, roomCode);
    }
  });

  // Next scenario
  socket.on('nextScenario', (roomCode) => {
    const room = gameManager.getRoom(roomCode);
    if (!room || room.host !== socket.id) return;

    room.currentScenarioIndex++;

    if (room.currentScenarioIndex < room.scenarios.length) {
      // Reset ready status
      room.players.forEach(p => p.ready = false);
      startScenario(room, roomCode);
    } else {
      // Game complete - show final results
      showFinalResults(room, roomCode);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    
    // Find and remove player from any room
    const room = gameManager.findRoomByPlayerId(socket.id);
    if (room) {
      gameManager.removePlayer(room.code, socket.id);
      
      io.to(room.code).emit('playerLeft', {
        players: room.players,
        disconnectedPlayerId: socket.id
      });

      // If host left, assign new host or close room
      if (room.players.length === 0) {
        gameManager.deleteRoom(room.code);
        console.log(`Room ${room.code} closed - no players remaining`);
      } else if (room.host === socket.id) {
        room.host = room.players[0].id;
        io.to(room.code).emit('newHost', { hostId: room.host });
      }
    }
  });
});

// Helper function to start a scenario
function startScenario(room, roomCode) {
  const scenario = room.scenarios[room.currentScenarioIndex];
  room.gameState = 'scenario';
  
  io.to(roomCode).emit('scenarioStart', {
    scenarioNumber: room.currentScenarioIndex + 1,
    totalScenarios: room.scenarios.length,
    scenario: {
      id: scenario.id,
      context: scenario.context,
      challenge: scenario.challenge,
      options: scenario.options.map(opt => ({
        id: opt.id,
        text: opt.text
      })),
      timeLimit: scenario.timeLimit || 90
    }
  });
}

// Helper function to show scenario results
function showScenarioResults(room, roomCode) {
  const scenario = room.scenarios[room.currentScenarioIndex];
  const responses = room.responses[scenario.id];
  
  room.gameState = 'discussion';
  
  io.to(roomCode).emit('scenarioResults', {
    scenario: scenario,
    responses: Object.values(responses),
    discussionTime: 240 // 4 minutes
  });
}

// Helper function to show final results
function showFinalResults(room, roomCode) {
  room.gameState = 'results';
  
  // Calculate group averages
  const groupScores = {
    selfAwareness: 0,
    selfRegulation: 0,
    motivation: 0,
    empathy: 0,
    socialSkills: 0
  };

  room.players.forEach(player => {
    if (player.scores) {
      Object.keys(groupScores).forEach(component => {
        groupScores[component] += player.scores[component];
      });
    }
  });

  // Average the scores
  Object.keys(groupScores).forEach(component => {
    groupScores[component] = groupScores[component] / room.players.length;
  });

  io.to(roomCode).emit('finalResults', {
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      scores: p.scores
    })),
    groupScores: groupScores
  });
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎮 EI Leadership Game server running on port ${PORT}`);
  console.log(`📍 Access the game at http://localhost:${PORT}`);
});

// Made with Bob
