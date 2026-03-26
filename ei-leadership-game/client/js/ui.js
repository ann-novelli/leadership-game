// UI Management and Helper Functions

// Screen management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Loading indicator
function showLoading(show = true) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

// Update lobby display
function updateLobby(roomCode, players, isHost) {
    // Update room code
    document.getElementById('room-code').textContent = roomCode;
    
    // Generate and display shareable link
    const shareLink = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    const shareLinkInput = document.getElementById('share-link');
    if (shareLinkInput) {
        shareLinkInput.value = shareLink;
    }
    
    // Update players list if provided
    if (players) {
        const playersList = document.getElementById('players-list');
        const playerCount = document.getElementById('player-count');
        
        playerCount.textContent = players.length;
        
        playersList.innerHTML = players.map(player => `
            <div class="player-item ${player.id === socketManager.socket.id ? 'host' : ''}">
                <span class="player-icon">👤</span>
                <span class="player-name">${player.name}</span>
                ${player.id === socketManager.socket.id && isHost ? '<span class="player-badge">Host</span>' : ''}
            </div>
        `).join('');
    }
    
    // Update start button
    const startBtn = document.getElementById('start-game-btn');
    if (isHost) {
        startBtn.disabled = players && players.length < 3;
        startBtn.textContent = players && players.length >= 3
            ? 'Start Game'
            : `Start Game (Need ${3 - (players ? players.length : 0)} more players)`;
    } else {
        startBtn.disabled = true;
        startBtn.textContent = 'Waiting for host to start...';
    }
}

// Update ready status in introduction screen
function updateReadyStatus(readyCount, totalPlayers) {
    const statusDiv = document.getElementById('ready-status');
    statusDiv.textContent = `${readyCount} of ${totalPlayers} players ready`;
    
    if (readyCount === totalPlayers) {
        statusDiv.textContent += ' - Starting scenario...';
    }
}

// Display scenario
let selectedOption = null;
let currentScenarioId = null;

function displayScenario(data) {
    currentScenarioId = data.scenario.id;
    selectedOption = null;
    
    // Update progress
    document.getElementById('current-scenario').textContent = data.scenarioNumber;
    document.getElementById('total-scenarios').textContent = data.totalScenarios;
    
    // Update category
    document.getElementById('scenario-category').textContent = data.scenario.category || 'Leadership Scenario';
    
    // Update scenario text
    document.getElementById('scenario-context').textContent = data.scenario.context;
    document.getElementById('scenario-challenge').textContent = data.scenario.challenge;
    
    // Display options
    const optionsList = document.getElementById('options-list');
    optionsList.innerHTML = data.scenario.options.map(option => `
        <div class="option-card" data-option-id="${option.id}">
            <div class="option-letter">${option.id}</div>
            <div class="option-text">${option.text}</div>
        </div>
    `).join('');
    
    // Add click handlers to options
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => selectOption(card));
    });
    
    // Reset submit button
    document.getElementById('submit-response-btn').disabled = true;
    document.getElementById('response-status').textContent = '';
}

function selectOption(card) {
    // Remove previous selection
    document.querySelectorAll('.option-card').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Add selection to clicked card
    card.classList.add('selected');
    selectedOption = card.dataset.optionId;
    
    // Enable submit button
    document.getElementById('submit-response-btn').disabled = false;
}

// Timer management
let timerInterval = null;

function startTimer(seconds) {
    let remaining = seconds;
    const timerDisplay = document.getElementById('timer-display');
    
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    function updateDisplay() {
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        // Update timer color based on remaining time
        timerDisplay.className = 'scenario-timer';
        if (remaining <= 10) {
            timerDisplay.classList.add('danger');
        } else if (remaining <= 30) {
            timerDisplay.classList.add('warning');
        }
    }
    
    updateDisplay();
    
    timerInterval = setInterval(() => {
        remaining--;
        updateDisplay();
        
        if (remaining <= 0) {
            clearInterval(timerInterval);
            // Auto-submit if no response selected
            if (!selectedOption) {
                showToast('Time\'s up! Please select a response.', 'warning');
            }
        }
    }, 1000);
}

function startDiscussionTimer(seconds) {
    let remaining = seconds;
    const timerDisplay = document.getElementById('discussion-timer');
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        remaining--;
        
        if (remaining <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = 'Discussion time complete';
        }
    }, 1000);
}

// Update response status
function updateResponseStatus(responseCount, totalPlayers) {
    const statusDiv = document.getElementById('response-status');
    statusDiv.textContent = `${responseCount} of ${totalPlayers} players have responded`;
    
    if (responseCount === totalPlayers) {
        statusDiv.textContent = 'All players responded! Moving to discussion...';
    }
}

// Display scenario results
function displayResults(data) {
    const { scenario, responses } = data;
    
    // Display responses
    const responsesDisplay = document.getElementById('responses-display');
    responsesDisplay.innerHTML = responses.map(response => {
        const option = scenario.options.find(opt => opt.id === response.optionId);
        return `
            <div class="response-item">
                <div class="response-player">${response.playerName}</div>
                <div class="response-choice">Option ${response.optionId}</div>
                <div class="response-text">${option ? option.text : ''}</div>
            </div>
        `;
    }).join('');
    
    // Display EI mapping for each option
    const eiMappingDisplay = document.getElementById('ei-mapping-display');
    const componentNames = {
        selfAwareness: 'Self-Awareness',
        selfRegulation: 'Self-Regulation',
        motivation: 'Motivation',
        empathy: 'Empathy',
        socialSkills: 'Social Skills'
    };
    
    // Aggregate scores across all options
    const aggregateScores = {};
    scenario.options.forEach(option => {
        if (option.scores) {
            Object.keys(option.scores).forEach(component => {
                if (!aggregateScores[component]) {
                    aggregateScores[component] = 0;
                }
                aggregateScores[component] += option.scores[component];
            });
        }
    });
    
    eiMappingDisplay.innerHTML = Object.keys(aggregateScores).map(component => `
        <div class="ei-score-card ${component}">
            <div class="ei-score-label">${componentNames[component]}</div>
            <div class="ei-score-value">${aggregateScores[component] > 0 ? '+' : ''}${aggregateScores[component]}</div>
        </div>
    `).join('');
    
    // Display discussion prompts
    const discussionPrompts = document.getElementById('discussion-prompts');
    discussionPrompts.innerHTML = scenario.discussionPrompts.map(prompt => `
        <li>${prompt}</li>
    `).join('');
    
    // Display learning points
    const learningPoints = document.getElementById('learning-points');
    learningPoints.innerHTML = scenario.learningPoints.map(point => `
        <li>${point}</li>
    `).join('');
    
    // Enable next button for host
    const nextBtn = document.getElementById('next-scenario-btn');
    if (socketManager.isHost) {
        nextBtn.disabled = false;
    }
}

// Display final results
function displayFinalResults(data, currentPlayerId) {
    const { players, groupScores } = data;
    
    // Find current player
    const currentPlayer = players.find(p => p.id === currentPlayerId);
    
    if (currentPlayer && currentPlayer.scores) {
        // Create individual chart
        createRadarChart('individual-chart', currentPlayer.scores, currentPlayer.name);
        
        // Display individual scores
        displayScoreDetails('individual-scores', currentPlayer.scores);
        
        // Generate insights
        generateInsights(currentPlayer.scores);
    }
    
    // Create group chart
    createRadarChart('group-chart', groupScores, 'Group Average');
    
    // Display group scores
    displayScoreDetails('group-scores', groupScores);
}

function displayScoreDetails(elementId, scores) {
    const element = document.getElementById(elementId);
    const componentNames = {
        selfAwareness: 'Self-Awareness',
        selfRegulation: 'Self-Regulation',
        motivation: 'Motivation',
        empathy: 'Empathy',
        socialSkills: 'Social Skills'
    };
    
    element.innerHTML = Object.keys(scores).map(component => `
        <div class="score-item">
            <div class="score-component ${component}">${componentNames[component]}</div>
            <div class="score-value">${scores[component].toFixed(1)}</div>
        </div>
    `).join('');
}

function generateInsights(scores) {
    const insightsDisplay = document.getElementById('insights-display');
    const componentNames = {
        selfAwareness: 'Self-Awareness',
        selfRegulation: 'Self-Regulation',
        motivation: 'Motivation',
        empathy: 'Empathy',
        socialSkills: 'Social Skills'
    };
    
    // Find highest and lowest scores
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const strengths = sortedScores.slice(0, 2);
    const development = sortedScores.slice(-2);
    
    insightsDisplay.innerHTML = `
        <div class="insight-item strength">
            <h3>💪 Your Strengths</h3>
            <p>You scored highest in <strong>${componentNames[strengths[0][0]]}</strong> and <strong>${componentNames[strengths[1][0]]}</strong>. 
            These are your natural leadership strengths. Continue to leverage these in your leadership approach.</p>
        </div>
        <div class="insight-item development">
            <h3>🎯 Development Opportunities</h3>
            <p>Consider focusing on <strong>${componentNames[development[0][0]]}</strong> and <strong>${componentNames[development[1][0]]}</strong>. 
            These areas offer the greatest potential for growth in your emotional intelligence.</p>
        </div>
    `;
    
    // Generate recommendations
    generateRecommendations(development);
}

function generateRecommendations(developmentAreas) {
    const recommendationsDisplay = document.getElementById('recommendations-display');
    
    const recommendations = {
        selfAwareness: {
            title: 'Developing Self-Awareness',
            text: 'Practice regular self-reflection. Keep a leadership journal to track your emotional responses and their impact on others. Seek feedback from trusted colleagues about your strengths and blind spots.'
        },
        selfRegulation: {
            title: 'Improving Self-Regulation',
            text: 'Develop techniques to manage stress and impulses. Practice pausing before reacting in challenging situations. Build habits that promote emotional balance, such as mindfulness or exercise.'
        },
        motivation: {
            title: 'Enhancing Motivation',
            text: 'Connect your work to your deeper values and purpose. Set challenging but achievable goals. Celebrate progress and maintain optimism even during setbacks.'
        },
        empathy: {
            title: 'Building Empathy',
            text: 'Practice active listening without judgment. Make time to understand others\' perspectives before responding. Pay attention to non-verbal cues and emotional undercurrents in conversations.'
        },
        socialSkills: {
            title: 'Strengthening Social Skills',
            text: 'Focus on building genuine relationships. Practice clear, persuasive communication. Develop your ability to find common ground and build consensus in diverse groups.'
        }
    };
    
    recommendationsDisplay.innerHTML = developmentAreas.map(([component]) => {
        const rec = recommendations[component];
        return `
            <div class="recommendation-item">
                <h3>${rec.title}</h3>
                <p>${rec.text}</p>
            </div>
        `;
    }).join('');
}

// Copy room code to clipboard
function copyRoomCode() {
    const roomCode = document.getElementById('room-code').textContent;
    navigator.clipboard.writeText(roomCode).then(() => {
        showToast('Room code copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy room code', 'error');
    });
}

// Made with Bob
