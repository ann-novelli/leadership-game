class GameManager {
  constructor() {
    this.playerColors = ['#4A90E2', '#7ED321', '#F5A623', '#BD10E0', '#E24A4A', '#FF6B6B', '#4ECDC4', '#95E1D3'];
    this.playerAvatars = ['🔵', '🟢', '🟡', '🟣', '🔴', '🟠', '🔷', '🟩'];
    this.rooms = new Map();
  }

  // Generate unique room code
  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Ensure uniqueness
    if (this.rooms.has(code)) {
      return this.generateRoomCode();
    }
    
    return code;
  }

  // Create new game room
  createRoom(hostId, hostName) {
    const code = this.generateRoomCode();
    const room = {
      code: code,
      host: hostId,
      players: [{
        id: hostId,
        color: this.playerColors[0],
        avatar: this.playerAvatars[0],
        name: hostName,
        ready: false,
        scores: {
          selfAwareness: 0,
          selfRegulation: 0,
          motivation: 0,
          empathy: 0,
          socialSkills: 0
        }
      }],
      gameState: 'lobby', // lobby, introduction, scenario, discussion, results
      scenarios: [],
      currentScenarioIndex: 0,
      responses: {},
      createdAt: Date.now()
    };

    this.rooms.set(code, room);
    return room;
  }

  // Join existing room
  joinRoom(roomCode, playerId, playerName) {
    const room = this.rooms.get(roomCode);

    if (!room) {
      return { success: false, message: 'Room not found' };
    }

    if (room.gameState !== 'lobby') {
      return { success: false, message: 'Game already in progress' };
    }

    if (room.players.length >= 8) {
      return { success: false, message: 'Room is full (max 8 players)' };
    }

    // Check if player already in room
    if (room.players.find(p => p.id === playerId)) {
      return { success: false, message: 'Already in this room' };
    }

    // Add player
    room.players.push({
      id: playerId,
      color: this.playerColors[room.players.length % this.playerColors.length],
      avatar: this.playerAvatars[room.players.length % this.playerAvatars.length],
      name: playerName,
      ready: false,
      scores: {
        selfAwareness: 0,
        selfRegulation: 0,
        motivation: 0,
        empathy: 0,
        socialSkills: 0
      }
    });

    return { success: true, room: room };
  }

  // Get room by code
  getRoom(roomCode) {
    return this.rooms.get(roomCode);
  }

  // Find room by player ID
  findRoomByPlayerId(playerId) {
    for (const [code, room] of this.rooms) {
      if (room.players.find(p => p.id === playerId)) {
        return room;
      }
    }
    return null;
  }

  // Remove player from room
  removePlayer(roomCode, playerId) {
    const room = this.rooms.get(roomCode);
    if (!room) return false;

    room.players = room.players.filter(p => p.id !== playerId);
    return true;
  }

  // Delete room
  deleteRoom(roomCode) {
    return this.rooms.delete(roomCode);
  }

  // Get all rooms (for debugging)
  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  // Clean up old rooms (optional - run periodically)
  cleanupOldRooms(maxAgeMs = 3600000) { // 1 hour default
    const now = Date.now();
    for (const [code, room] of this.rooms) {
      if (now - room.createdAt > maxAgeMs) {
        this.rooms.delete(code);
        console.log(`Cleaned up old room: ${code}`);
      }
    }
  }
}

module.exports = GameManager;

// Made with Bob
