const express = require('express');
const mongoose = require('mongoose');
const loginModel = require('./Models/login')
const userModel = require('./Models/score')
const cors = require('cors');
const session = require('express-session');
const app = express();

app.use(
    session({
      secret: 'secret234ky', // Change this to a secure secret key
      resave: false,
      saveUninitialized: true,
    })
  );
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));

mongoose.connect("mongodb://localhost:27017/logindetails");



app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // console.log(username);
        const user = await loginModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        const storedPassword = String(user.password);
        const incomingPassword = String(password);

        // Check if the password matches
        if (storedPassword !== incomingPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Successful login
        return res.status(200).json({ message: 'Login successful',username });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});


app.post('/Signup', async (req, res) => {
    try {
        const existingUser = await loginModel.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Password validation: at least 6 characters, 2 digits, and 2 uppercase letters
        const password = req.body.password;
        const digitCount = (password.match(/\d/g) || []).length;
        const uppercaseCount = (password.match(/[A-Z]/g) || []).length;

        if (password.length < 6 || digitCount < 1 || uppercaseCount < 1) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long with at least 2 digits and 2 uppercase letters'
            });
        }
        const newUser = await loginModel.create(req.body);
        res.json(newUser);
    }
    catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/savescore', async (req, res) => {
    try {
      const { username, score, winnerPlayer } = req.body;

      await userModel.create({
        score:score,
        playerid:winnerPlayer,
        date: new Date()
      });
      //console.log(user);

      res.json({ message: 'Save successful' });
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/prevscores', async (req,res)=>{
    const {username} = req.params;
    try{
      const user = await userModel.find({username});
      //console.log(user);
      if(!user){
        return res.status(404).json({error: 'User not found'});
      }
      res.json({prevScores: user});
    }
    catch(error){
      console.log("Error getting previous scores", error);
      res.status(500).json({error: 'Internal Server Error'});
    }
  });

  app.delete('/:username', async (req, res) => {
    const { username } = req.params;

    try {
      // Find and delete the user by username
      const result = await loginModel.findOneAndDelete({ username });

      if (result) {
        res.status(200).json({ message: 'Account deleted successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(`Error deleting account: ${error.message}`);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });





app.listen(process.env.PORT||3000,()=>{
    console.log("server is running on 3000");
})
