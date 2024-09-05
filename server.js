require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
const allowedOrigins = [
    'https://thiba.netlify.app', // Replace with your actual frontend domain
    'http://localhost:3000' // For local development
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));


mongoose.connect(process.env.MONGO_URI, {dbName: 'selfcareData'})
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));

// User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true },
    level: { type: Number },
    challenge: { type: Number }
});

const User = mongoose.model('User', userSchema);

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Split the token from "Bearer <token>"
    const splitToken = token.split(' ')[1];
    
    try {
        const decoded = jwt.verify(splitToken, process.env.JWT_SECRET);
        req.user = decoded;  // Attach the decoded user info to the request object
        next();  // Continue to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Just for checking if it actually connects to the database
app.get('/ping', (req, res) => {
    res.json({ message: 'Connected to backend' });
});

// Register route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword, level: 1,  challenge: 1});
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users
app.get('/collections/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// Get all levels
app.get('/collections/levels', async (req, res) => {
    try {
        const levelsCollection = mongoose.connection.collection('levels');
        const levels = await levelsCollection.find({}).toArray();
        res.json(levels);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

// Get the current logged-in user
app.get('/current-user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');  // Exclude the password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);  // Send the user details as a JSON response
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

app.post('/complete-challenge', authMiddleware, async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const maxChallengesPerLevel = 30;

        // Check if the user is completing the last challenge of the current level
        if (user.challenge < maxChallengesPerLevel) {
            // Increment the challenge within the current level
            user.challenge += 1;
        } else {
            // If the last challenge of the level is completed, reset to challenge 1 and increment the level
            user.challenge = 1;
            user.level += 1;
        }
        if (user.level > 6){
            user.challenge = 1;
            user.level = 1;
        }

        // Save the updated user data
        await user.save();

        res.status(200).json({ message: 'Challenge completed', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
