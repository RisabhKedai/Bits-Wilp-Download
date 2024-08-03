      // server.js
      const express = require('express');
      const bodyParser = require('body-parser');
      const jwt = require('jsonwebtoken');
      const app = express();
      const PORT = 3000;
      const secretKey = 'yourSecretKey'; // Replace with your secret key
      // Middleware to parse JSON bodies
      app.use(bodyParser.json());
      // Dummy user data for demonstration
      const users = [
        { id: 1, username: 'user1', password: 'password1' },
        { id: 2, username: 'user2', password: 'password2' }
      ];
      
      // Login route
      app.post('/login', (req, res) => {
        // Mocked authentication logic
        const { username, password } = req.body;
        const user = users.find(u => u.username === username && u.password === password);
        
        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
      
        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
        
        res.json({ token });
      });
      
      // Dummy protected route
      app.get('/protected', authenticateToken, (req, res) => {
        res.json({ message: 'Protected route accessed successfully' });
      });
      
      // Middleware to authenticate JWT token
      function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
      
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      
        jwt.verify(token, secretKey, (err, user) => {
          if (err) {
            return res.status(403).json({ message: 'Invalid token' });
          }
          req.user = user;
          next();
        });
      }
      
      // Start the server
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
      