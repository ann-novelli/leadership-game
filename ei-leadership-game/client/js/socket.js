// Socket.io connection and event handling
class SocketManager {
    constructor() {
        this.socket = null;
        this.roomCode = null;
        this.playerId = null;
        this.playerName = null;
        this.isHost = false;
    }

    // Initialize socket connection
    connect() {
        this.socket = io();
        this.setupEventListeners();
        return this.socket;
    }

    // Setup all socket event listeners
    setupEventListeners() {
        // Connection events
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.playerId = this.socket.id;
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            showToast('Disconnected from server', 'error');
        });

        // Room events
        this.socket.on('roomCreated', (data) => {
            this.roomCode = data.roomCode;
            this.playerId = data.playerId;
            this.playerName = data.playerName;
            this.isHost = true;
            
            console.log('Room created:', data);
            showScreen('lobby-screen');
            updateLobby(data.roomCode, [{ id: data.playerId, name: data.playerName }], true);
            showToast('Room created successfully!', 'success');
        });

        this.socket.on('roomJoined', (data) => {
            this.roomCode = data.roomCode;
            this.playerId = data.playerId;
            this.playerName = data.playerName;
            this.isHost = false;
            
            console.log('Room joined:', data);
            showScreen('lobby-screen');
            showToast('Joined room successfully!', 'success');
        });

        this.socket.on('joinError', (data) => {
            console.error('Join error:', data.message);
            showToast(data.message, 'error');
        });

        this.socket.on('playerJoined', (data) => {
            console.log('Player joined:', data);
            updateLobby(this.roomCode, data.players, this.isHost);
            sounds.playerJoin();
            showToast(`${data.newPlayer} joined the game`, 'success');
        });

        this.socket.on('playerLeft', (data) => {
            console.log('Player left:', data);
            updateLobby(this.roomCode, data.players, this.isHost);
            showToast('A player left the game', 'warning');
        });

        this.socket.on('newHost', (data) => {
            if (data.hostId === this.playerId) {
                this.isHost = true;
                showToast('You are now the host', 'success');
                updateLobby(this.roomCode, null, true);
            }
        });

        // Game events
        this.socket.on('gameStarted', (data) => {
            console.log('Game started:', data);
            showScreen('introduction-screen');
            showToast('Game starting!', 'success');
        });

        this.socket.on('playersReadyUpdate', (data) => {
            updateReadyStatus(data.readyCount, data.totalPlayers);
        });

        this.socket.on('scenarioStart', (data) => {
            console.log('Scenario started:', data);
            showScreen('scenario-screen');
            displayScenario(data);
            startTimer(data.scenario.timeLimit);
        });

        this.socket.on('responseReceived', (data) => {
            updateResponseStatus(data.responseCount, data.totalPlayers);
        });

        this.socket.on('scenarioResults', (data) => {
            console.log('Scenario results:', data);
            showScreen('discussion-screen');
            displayResults(data);
            sounds.scenarioComplete();
            startDiscussionTimer(data.discussionTime);
        });

        this.socket.on('finalResults', (data) => {
            console.log('Final results:', data);
            sounds.gameComplete();
            showScreen('results-screen');
            displayFinalResults(data, this.playerId);
        });

        // Error handling
        this.socket.on('error', (data) => {
            console.error('Server error:', data.message);
            showToast(data.message, 'error');
        });
    }

    // Emit events
    createRoom(playerName) {
        this.socket.emit('createRoom', playerName);
    }

    joinRoom(roomCode, playerName) {
        this.socket.emit('joinRoom', { roomCode, playerName });
    }

    startGame() {
        if (this.isHost) {
            this.socket.emit('startGame', this.roomCode);
        }
    }

    playerReady() {
        this.socket.emit('playerReady', this.roomCode);
    }

    submitResponse(scenarioId, optionId) {
        this.socket.emit('submitResponse', {
            roomCode: this.roomCode,
            scenarioId: scenarioId,
            optionId: optionId
        });
    }

    nextScenario() {
        if (this.isHost) {
            this.socket.emit('nextScenario', this.roomCode);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

// Create global socket manager instance
const socketManager = new SocketManager();

// Made with Bob
