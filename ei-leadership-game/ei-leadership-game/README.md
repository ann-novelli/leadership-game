# Emotional Intelligence Leadership Game

A multiplayer interactive web game (3-8 players) that assesses and facilitates discussion around Emotional Intelligence based on Daniel Goleman's seminal work "What Makes a Leader" from the Harvard Business Review.

## 🎯 Overview

This game helps teams and individuals:
- Assess their emotional intelligence across five key components
- Engage in meaningful discussions about leadership scenarios
- Identify strengths and development areas
- Learn practical applications of EI in workplace situations

## 📚 Based on Research

The game is grounded in Daniel Goleman's research on emotional intelligence, which identifies five critical components that distinguish outstanding leaders:

1. **Self-Awareness** - Understanding your emotions and their impact
2. **Self-Regulation** - Managing disruptive impulses and moods
3. **Motivation** - Passion for work beyond money or status
4. **Empathy** - Understanding others' emotional makeup
5. **Social Skills** - Managing relationships effectively

## 🎮 Game Features

### Multiplayer Experience
- **3-8 players** per game session
- **Real-time synchronization** via WebSocket
- **45-50 minute** gameplay duration
- **Interactive discussions** after each scenario

### Scenario-Based Assessment
- **8 workplace scenarios** covering different leadership challenges
- **Multiple-choice responses** with EI component mapping
- **Timed responses** (90 seconds per scenario)
- **Discussion prompts** to facilitate learning

### Results & Analytics
- **Individual EI profile** with radar chart visualization
- **Group aggregate analysis** for team insights
- **Strengths and development areas** identification
- **Personalized recommendations** for growth
- **Downloadable results** for future reference

## 🚀 Quick Start

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Navigate to the game directory:**
```bash
cd ei-leadership-game
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the server:**
```bash
npm start
```

4. **Open your browser:**
```
http://localhost:3000
```

### For Development

Use nodemon for auto-restart on file changes:
```bash
npm run dev
```

## 📖 How to Play

### 1. Create or Join a Game

**Host (Create Game):**
- Enter your name
- Click "Create New Game"
- Share the 6-character room code with players

**Players (Join Game):**
- Enter your name
- Enter the room code
- Click "Join Game"

### 2. Game Lobby

- Wait for 3-8 players to join
- Review the five EI components
- Host clicks "Start Game" when ready

### 3. Introduction

- Read the game overview
- Understand the scoring system
- Click "I'm Ready" when prepared

### 4. Scenario Rounds

For each scenario:
- Read the workplace situation (30 seconds)
- Select your response (90 seconds)
- Wait for all players to respond
- Discuss choices and insights (4 minutes)
- Move to next scenario

### 5. Results & Reflection

- View your individual EI profile
- Compare with group average
- Review strengths and development areas
- Get personalized recommendations
- Download results for future reference

## 🏗️ Technical Architecture

### Technology Stack

**Backend:**
- Node.js + Express
- Socket.io for real-time communication
- In-memory game state management

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Chart.js for visualizations
- Responsive design

**Data:**
- JSON-based scenario storage
- No database required

### File Structure

```
ei-leadership-game/
├── server/
│   ├── server.js              # Main server & Socket.io
│   ├── gameManager.js         # Room management
│   └── scenarioEngine.js      # Scenario logic
├── client/
│   ├── index.html             # Main HTML
│   ├── css/
│   │   ├── styles.css         # Main styles
│   │   └── components.css     # Component styles
│   ├── js/
│   │   ├── game.js            # Game initialization
│   │   ├── socket.js          # WebSocket handling
│   │   ├── ui.js              # UI management
│   │   └── charts.js          # Chart visualizations
│   └── assets/
│       └── images/
├── data/
│   └── scenarios.json         # Game scenarios
├── package.json
└── README.md
```

## 🎨 EI Component Colors

The game uses distinct colors for each EI component:

- **Self-Awareness**: Blue (#4A90E2)
- **Self-Regulation**: Green (#7ED321)
- **Motivation**: Orange (#F5A623)
- **Empathy**: Purple (#BD10E0)
- **Social Skills**: Red (#E24A4A)

## 🔧 Configuration

### Port Configuration

Default port is 3000. To change:

```bash
PORT=8080 npm start
```

Or set in `.env` file:
```
PORT=8080
```

### Scenario Customization

Edit `data/scenarios.json` to:
- Add new scenarios
- Modify existing scenarios
- Adjust scoring weights
- Update discussion prompts

### Game Settings

In `server/scenarioEngine.js`, adjust:
- Number of scenarios per game (default: 6)
- Scenario selection logic
- Time limits

## 🌐 Deployment

### Local Network

To play on local network:
1. Start the server
2. Find your local IP address
3. Share `http://YOUR_IP:3000` with players

### Cloud Deployment

**Heroku:**
```bash
heroku create your-app-name
git push heroku main
```

**AWS, Google Cloud, DigitalOcean:**
- Deploy as Node.js application
- Ensure WebSocket support
- Set PORT environment variable

## 🎓 Educational Use

### For Facilitators

**Pre-Game:**
- Review scenarios beforehand
- Prepare additional discussion questions
- Set expectations for respectful dialogue

**During Game:**
- Encourage honest responses
- Facilitate balanced discussions
- Draw connections to real experiences

**Post-Game:**
- Debrief key insights
- Create action plans
- Schedule follow-up discussions

### For Teams

**Best Practices:**
- Play in a comfortable, private setting
- Allow adequate time (60-75 minutes total)
- Encourage vulnerability and openness
- Focus on learning, not competition
- Follow up with development activities

## 📊 Scoring System

### Response Scoring
- Each option has weighted scores for relevant EI components
- Scores range from -2 (counterproductive) to +3 (exemplary)
- Neutral responses score 0-1
- Cumulative scoring across all scenarios

### Results Interpretation
- **High scores (8+)**: Strong competency
- **Medium scores (4-7)**: Developing competency
- **Low scores (0-3)**: Growth opportunity
- **Negative scores**: Area needing attention

## 🐛 Troubleshooting

### Connection Issues
- Ensure server is running
- Check firewall settings
- Verify WebSocket support
- Try different browser

### Game Not Starting
- Minimum 3 players required
- Only host can start game
- All players must be in lobby

### Display Issues
- Clear browser cache
- Update to latest browser version
- Check screen resolution (min 1024x768)
- Disable browser extensions

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional scenarios
- Enhanced visualizations
- Mobile optimization
- Accessibility features
- Internationalization

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **Daniel Goleman** for the foundational research on emotional intelligence
- **Harvard Business Review** for publishing "What Makes a Leader"
- All contributors and testers

## 📚 Further Reading

- Goleman, D. (1998). "What Makes a Leader." Harvard Business Review
- Goleman, D. (1995). *Emotional Intelligence*
- Goleman, D., Boyatzis, R., & McKee, A. (2002). *Primal Leadership*
- HBR's 10 Must Reads on Emotional Intelligence

## 📞 Support

For issues, questions, or feedback:
- Open an issue on GitHub
- Contact the development team
- Review documentation

## 🔄 Version History

### Version 1.0.0 (Current)
- Initial release
- 8 workplace scenarios
- 5 EI component assessment
- Real-time multiplayer (3-8 players)
- Results visualization
- Downloadable results

## 🎯 Future Enhancements

- [ ] Persistent user accounts
- [ ] Custom scenario creation
- [ ] Team analytics dashboard
- [ ] Mobile app versions
- [ ] AI-powered insights
- [ ] Video discussion integration
- [ ] Multilingual support
- [ ] Industry-specific scenarios
- [ ] Integration with LMS platforms

---

**Built with ❤️ for leadership development**

*This game is an educational tool based on Daniel Goleman's research. All scenarios are original creations inspired by the EI framework.*