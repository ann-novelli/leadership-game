# Quick Start Guide

## Installation & Setup

### Step 1: Install Node.js
If you don't have Node.js installed:
1. Visit https://nodejs.org/
2. Download and install the LTS version (16 or higher)
3. Verify installation: `node --version` and `npm --version`

### Step 2: Install Dependencies
```bash
cd ei-leadership-game
npm install
```

This will install:
- express (web server)
- socket.io (real-time communication)
- cors (cross-origin support)
- nodemon (development tool)

### Step 3: Start the Server
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

### Step 4: Open the Game
Open your browser and navigate to:
```
http://localhost:3000
```

## Playing the Game

### Single Computer Testing
1. Open multiple browser tabs/windows
2. Create a game in one tab
3. Join with the room code in other tabs
4. You can simulate 3-8 players this way

### Multiple Players (Same Network)
1. Start the server on one computer
2. Find your local IP address:
   - **Mac/Linux**: `ifconfig | grep inet`
   - **Windows**: `ipconfig`
3. Share the URL with players: `http://YOUR_IP:3000`
4. Players join using the room code

### Multiple Players (Internet)
Deploy to a cloud service:
- **Heroku**: Free tier available
- **Railway**: Easy deployment
- **Render**: Simple setup
- **DigitalOcean**: App Platform

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
PORT=8080 npm start
```

### Cannot Connect
- Check firewall settings
- Ensure server is running
- Verify correct IP/port
- Try a different browser

### WebSocket Issues
- Disable browser extensions
- Check antivirus/firewall
- Ensure WebSocket support in browser

## Game Flow Summary

1. **Landing** → Enter name, create/join room
2. **Lobby** → Wait for 3-8 players
3. **Introduction** → Learn about EI components
4. **Scenarios** → 6-8 rounds of decision-making
5. **Discussion** → 4 minutes per scenario
6. **Results** → View EI profile and insights

## Tips for Best Experience

### For Hosts
- Test the game beforehand
- Ensure stable internet connection
- Have 45-60 minutes available
- Prepare discussion space

### For Players
- Be honest in responses
- Participate in discussions
- Keep an open mind
- Focus on learning, not winning

### For Facilitators
- Review scenarios in advance
- Prepare additional questions
- Create safe discussion environment
- Follow up with action plans

## Next Steps

After playing:
1. Download your results
2. Reflect on insights
3. Create development plan
4. Schedule follow-up discussions
5. Track progress over time

## Support

For issues or questions:
- Check README.md for detailed documentation
- Review troubleshooting section
- Check browser console for errors
- Verify all files are present

## File Checklist

Ensure these files exist:
```
✓ server/server.js
✓ server/gameManager.js
✓ server/scenarioEngine.js
✓ client/index.html
✓ client/css/styles.css
✓ client/css/components.css
✓ client/js/game.js
✓ client/js/socket.js
✓ client/js/ui.js
✓ client/js/charts.js
✓ data/scenarios.json
✓ package.json
✓ README.md
```

## Development

### Adding Scenarios
Edit `data/scenarios.json`:
```json
{
  "id": "scenario-9",
  "category": "Your Category",
  "context": "Situation description",
  "challenge": "What do you do?",
  "timeLimit": 90,
  "options": [...],
  "discussionPrompts": [...],
  "learningPoints": [...]
}
```

### Customizing Styles
Edit `client/css/styles.css` or `client/css/components.css`

### Modifying Game Logic
- Server logic: `server/server.js`
- Client logic: `client/js/game.js`
- UI updates: `client/js/ui.js`

---

**Ready to play? Run `npm install` then `npm start`!**