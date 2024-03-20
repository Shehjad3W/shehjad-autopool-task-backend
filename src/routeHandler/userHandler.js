const express = require('express');
const router = express.Router();
const User = require('../schemas/usersSchema');
const jwt = require("jsonwebtoken");
const verifyToken = require('../middlewares/verifyToken');
const generateUsernameRole = require('../utils/generateUsernameRole');
const generatePoolDetails = require('../utils/generatePoolDetails');

// get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.send(users);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: "Failed to get users!" });
    }
})

// get pool users
router.get('/poolUsers', async (req, res) => {
    try {
        const users = await User.find({ 'poolDetails.poolSerial': { $exists: true } }).select("-password");
        res.send(users);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: "Failed to get pool users!" });
    }
})


// signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        if (!email || !password)
            return res.status(422).send({ error: "Email and password are required!" });
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(422).send({ error: "Email already exists!" });
        }
        const username = await generateUsernameRole();
        const userData = { ...req.body, username };
        const user = await User.create(userData);
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ error: "Internal Server Error" });
    }
});


// login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(422).send({ message: "Email and password are required!" });
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(422).send({ message: "Invalid email or password!" });
        if (user.password !== password)
            return res.status(422).send({ message: "Invalid email or password!" });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (err) {
        console.log(err.message);
        res.status(422).send({ message: "Invalid email or password!" });
    }
})

// get user details
router.get('/me', verifyToken, async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];;
        if (!token)
            return res.status(401).send({ message: "You must be logged in!" });
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (err) {
        console.log(err);
        res.status(401).send({ message: "You must be logged in!" });
    }
})

// update user details
router.put('/me', verifyToken, async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token)
            return res.status(401).send({ message: "You must be logged in!" });
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
        res.send(user);
    } catch (err) {
        console.log(err.message);
        res.status(401).send({ message: "You must be logged in!" });
    }
})

// enter pool
router.put('/enterPool', verifyToken, async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token)
            return res.status(401).send({ message: "You must be logged in!" });

        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        if (!userId)
            return res.status(401).send({ message: "Invalid token!" });

        const poolDetails = await generatePoolDetails();
        if (!poolDetails)
            return res.status(500).send({ message: "Failed to generate pool details!" });

        const user = await User.findByIdAndUpdate(userId, { $set: { poolDetails } }, { new: true });
        if (!user)
            return res.status(404).send({ message: "User not found!" });

        res.send(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: "Pool Enter Failed!" });
    }
});

module.exports = router;
