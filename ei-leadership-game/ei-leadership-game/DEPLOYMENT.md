# Deployment Guide - Share Your Game Online

This guide will help you deploy the EI Leadership Game so you can share a link with players anywhere.

## 🌐 Quick Deployment Options

### Option 1: Render (Recommended - Free & Easy)

**Steps:**
1. Create account at https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository (or upload files)
4. Configure:
   - **Name**: ei-leadership-game
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Click "Create Web Service"
6. Wait 2-3 minutes for deployment
7. Your game will be live at: `https://your-app-name.onrender.com`

**Share the link with players!**

---

### Option 2: Railway (Fast & Simple)

**Steps:**
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Node.js and deploys
6. Get your URL from the deployment
7. Share: `https://your-app.railway.app`

---

### Option 3: Heroku (Popular Choice)

**Steps:**
1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login: `heroku login`
3. Create app:
   ```bash
   cd ei-leadership-game
   heroku create your-app-name
   ```
4. Deploy:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```
5. Open: `heroku open`
6. Share: `https://your-app-name.herokuapp.com`

---

### Option 4: DigitalOcean App Platform

**Steps:**
1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Connect GitHub or upload code
4. Select Node.js
5. Configure build and run commands
6. Deploy (takes 5-10 minutes)
7. Get your URL and share!

---

### Option 5: Local Network (No Internet Required)

**For playing on the same WiFi network:**

1. Start the server:
   ```bash
   npm start
   ```

2. Find your local IP address:
   - **Mac/Linux**: `ifconfig | grep inet`
   - **Windows**: `ipconfig`
   - Look for something like `192.168.1.100`

3. Share with players:
   ```
   http://YOUR_IP:3000
   ```
   Example: `http://192.168.1.100:3000`

4. Players on the same WiFi can access the game!

---

## 📱 How Players Join

### Method 1: Direct Link (Easiest)
When you create a game, share the full link:
```
https://your-game.com/?room=ABC123
```
Players click the link, enter their name, and join automatically!

### Method 2: Room Code
Players can also:
1. Go to your game URL
2. Enter their name
3. Enter the 6-character room code
4. Click "Join Game"

---

## 🔧 Environment Variables

For production deployment, you may want to set:

```bash
PORT=3000
NODE_ENV=production
```

Most platforms auto-detect the PORT, so you usually don't need to set it.

---

## 🚀 Pre-Deployment Checklist

Before deploying:
- [ ] Test locally with multiple browser tabs
- [ ] Ensure all files are committed
- [ ] Check package.json has correct start script
- [ ] Verify Node.js version compatibility (16+)
- [ ] Test with 3+ players

---

## 🔒 Security Considerations

For public deployment:
- Game rooms are temporary (in-memory)
- No persistent data storage
- Room codes expire when empty
- No authentication required
- Consider adding rate limiting for production

---

## 📊 Monitoring

After deployment, monitor:
- Server uptime
- WebSocket connections
- Active game rooms
- Player connections

Most platforms provide built-in monitoring dashboards.

---

## 🐛 Troubleshooting Deployment

### WebSocket Connection Issues
If players can't connect:
1. Ensure WebSocket support is enabled
2. Check firewall settings
3. Verify HTTPS/WSS for secure connections
4. Test with different browsers

### Port Issues
If the app won't start:
1. Check if PORT environment variable is set
2. Ensure no port conflicts
3. Verify the platform's port requirements

### Build Failures
If deployment fails:
1. Check Node.js version (16+)
2. Verify package.json is correct
3. Ensure all dependencies are listed
4. Check build logs for errors

---

## 💡 Tips for Best Experience

1. **Use HTTPS**: Most platforms provide this automatically
2. **Test First**: Deploy to a test environment first
3. **Share Links**: Use the shareable link feature in the lobby
4. **Monitor**: Keep an eye on active connections
5. **Backup**: Keep your code in version control (Git)

---

## 🎮 Playing After Deployment

1. **Host creates game** → Gets shareable link
2. **Host shares link** via email, Slack, Teams, etc.
3. **Players click link** → Auto-filled room code
4. **Players enter name** → Join instantly
5. **Start playing!**

---

## 📞 Support

If you encounter issues:
- Check platform-specific documentation
- Review server logs
- Test locally first
- Verify all files are deployed
- Check WebSocket compatibility

---

## 🎯 Quick Start Commands

```bash
# Local testing
npm install
npm start

# Git setup (if needed)
git init
git add .
git commit -m "Initial commit"

# Deploy to Heroku
heroku create
git push heroku main

# Deploy to Render
# Use their web interface - no CLI needed!
```

---

**Ready to share your game with the world? Pick a deployment option above and get started!**

The shareable link feature makes it super easy for players to join - just send them the link from the lobby screen! 🎉