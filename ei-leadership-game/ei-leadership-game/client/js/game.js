// Main game logic and initialization

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('EI Leadership Game initializing...');
    
    // Connect to server
    socketManager.connect();
    
    // Check for room code in URL
    checkForRoomCodeInURL();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('Game initialized successfully');
});

// Check if URL contains room code and auto-fill
function checkForRoomCodeInURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('room');
    
    if (roomCode) {
        const roomCodeInput = document.getElementById('room-code-input');
        if (roomCodeInput) {
            roomCodeInput.value = roomCode.toUpperCase();
            showToast('Room code loaded from link!', 'success');
        }
    }
}

function setupEventListeners() {
    // Landing screen
    const createRoomBtn = document.getElementById('create-room-btn');
    const joinRoomBtn = document.getElementById('join-room-btn');
    const playerNameInput = document.getElementById('player-name-input');
    const roomCodeInput = document.getElementById('room-code-input');
    
    createRoomBtn.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        if (!playerName) {
            showToast('Please enter your name', 'warning');
            return;
        }
        
        showLoading(true);
        socketManager.createRoom(playerName);
        setTimeout(() => showLoading(false), 500);
    });
    
    joinRoomBtn.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        const roomCode = roomCodeInput.value.trim().toUpperCase();
        
        if (!playerName) {
            showToast('Please enter your name', 'warning');
            return;
        }
        
        if (!roomCode || roomCode.length !== 6) {
            showToast('Please enter a valid 6-character room code', 'warning');
            return;
        }
        
        showLoading(true);
        socketManager.joinRoom(roomCode, playerName);
        setTimeout(() => showLoading(false), 500);
    });
    
    // Allow Enter key to submit
    playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createRoomBtn.click();
        }
    });
    
    roomCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            joinRoomBtn.click();
        }
    });
    
    // Auto-uppercase room code input
    roomCodeInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
    });
    
    // Lobby screen
    const startGameBtn = document.getElementById('start-game-btn');
    const leaveLobbyBtn = document.getElementById('leave-lobby-btn');
    const copyCodeBtn = document.getElementById('copy-code-btn');
    
    startGameBtn.addEventListener('click', () => {
        socketManager.startGame();
    });
    
    leaveLobbyBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to leave the lobby?')) {
            socketManager.disconnect();
            location.reload();
        }
    });
    
    copyCodeBtn.addEventListener('click', () => {
        copyRoomCode();
    const copyLinkBtn = document.getElementById('copy-link-btn');
    
    copyLinkBtn.addEventListener('click', () => {
        const shareLinkInput = document.getElementById('share-link');
        if (shareLinkInput) {
            shareLinkInput.select();
            navigator.clipboard.writeText(shareLinkInput.value).then(() => {
                showToast('Link copied to clipboard!', 'success');
            }).catch(() => {
                showToast('Failed to copy link', 'error');
            });
        }
    });
    
    });
    
    // Introduction screen
    const readyBtn = document.getElementById('ready-btn');
    
    readyBtn.addEventListener('click', () => {
        readyBtn.disabled = true;
        readyBtn.textContent = 'Waiting for others...';
        socketManager.playerReady();
    });
    
    // Scenario screen
    const submitResponseBtn = document.getElementById('submit-response-btn');
    
    submitResponseBtn.addEventListener('click', () => {
        if (!selectedOption) {
            showToast('Please select a response', 'warning');
            return;
        }
        
        submitResponseBtn.disabled = true;
        submitResponseBtn.textContent = 'Response Submitted';
        
        sounds.responseSubmit();
        socketManager.submitResponse(currentScenarioId, selectedOption);
        showToast('Response submitted!', 'success');
    });
    
    // Discussion screen
    const nextScenarioBtn = document.getElementById('next-scenario-btn');
    
    nextScenarioBtn.addEventListener('click', () => {
        nextScenarioBtn.disabled = true;
        socketManager.nextScenario();
    });
    
    // Results screen
    const playAgainBtn = document.getElementById('play-again-btn');
    const downloadResultsBtn = document.getElementById('download-results-btn');
    
    playAgainBtn.addEventListener('click', () => {
        if (confirm('Start a new game? This will return you to the landing page.')) {
            socketManager.disconnect();
            location.reload();
        }
    });
    
    downloadResultsBtn.addEventListener('click', () => {
        downloadResults();
    });
}

// Download results as text file
function downloadResults() {
    const playerName = socketManager.playerName || 'Player';
    const timestamp = new Date().toISOString().split('T')[0];
    
    // Get scores from the page
    const scoreElements = document.querySelectorAll('#individual-scores .score-item');
    let resultsText = `Emotional Intelligence Leadership Game Results\n`;
    resultsText += `Player: ${playerName}\n`;
    resultsText += `Date: ${timestamp}\n`;
    resultsText += `\n=== Your EI Profile ===\n\n`;
    
    scoreElements.forEach(element => {
        const component = element.querySelector('.score-component').textContent;
        const value = element.querySelector('.score-value').textContent;
        resultsText += `${component}: ${value}\n`;
    });
    
    resultsText += `\n=== Insights ===\n\n`;
    
    const insights = document.querySelectorAll('.insight-item');
    insights.forEach(insight => {
        const title = insight.querySelector('h3').textContent;
        const text = insight.querySelector('p').textContent;
        resultsText += `${title}\n${text}\n\n`;
    });
    
    resultsText += `\n=== Recommendations ===\n\n`;
    
    const recommendations = document.querySelectorAll('.recommendation-item');
    recommendations.forEach(rec => {
        const title = rec.querySelector('h3').textContent;
        const text = rec.querySelector('p').textContent;
        resultsText += `${title}\n${text}\n\n`;
    });
    
    resultsText += `\n---\n`;
    resultsText += `Based on Daniel Goleman's "What Makes a Leader" (Harvard Business Review, 1998)\n`;
    
    // Create and download file
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EI-Results-${playerName}-${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Results downloaded!', 'success');
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
        // Could reconnect if disconnected
    }
});

// Handle before unload
window.addEventListener('beforeunload', (e) => {
    if (socketManager.roomCode) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? You will be disconnected from the game.';
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showToast('An error occurred. Please refresh the page.', 'error');
});

// Utility: Format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Utility: Validate room code
function isValidRoomCode(code) {
    return /^[A-Z0-9]{6}$/.test(code);
}

// Utility: Sanitize input
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Debug mode (can be enabled via console)
window.enableDebugMode = function() {
    console.log('Debug mode enabled');
    window.debugMode = true;
    
    // Add debug info to UI
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
    `;
    document.body.appendChild(debugPanel);
    
    setInterval(() => {
        debugPanel.innerHTML = `
            <strong>Debug Info</strong><br>
            Room: ${socketManager.roomCode || 'None'}<br>
            Player: ${socketManager.playerName || 'None'}<br>
            ID: ${socketManager.playerId || 'None'}<br>
            Host: ${socketManager.isHost ? 'Yes' : 'No'}<br>
            Connected: ${socketManager.socket?.connected ? 'Yes' : 'No'}
        `;
    }, 1000);
};

console.log('💡 Tip: Type enableDebugMode() in console for debug info');

// Made with Bob
