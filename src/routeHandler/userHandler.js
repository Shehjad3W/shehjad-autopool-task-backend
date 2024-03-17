const express = require('express');
const router = express.Router();
const User = require('../schemas/usersSchema');
const jwt = require("jsonwebtoken");
const verifyToken = require('../middlewares/verifyToken');
const generateUsernameRole = require('../utils/generateUsernameRole');

router.post('/signup', async (req, res) => {
    try {
        const { username, role } = await generateUsernameRole();
        const userData = { ...req.body, username, role };
        console.log(userData);
        const user = await User.create(userData);
        console.log(req.body);
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (err) {
        console.log(err.message);
        res.status(422).send(err.message);
    }
})


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
        console.log(err);
        res.status(422).send({ message: "Invalid email or password!" });
    }
})

router.get('/me', verifyToken, async (req, res) => {
    try {
        // console.log("hitting");
        // console.log(req.headers.authorization);
        const token = req.headers.authorization.split(" ")[1];;
        if (!token)
            return res.status(401).send({ message: "You must be logged in!" });
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(underToken);
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (err) {
        console.log(err);
        res.status(401).send({ message: "You must be logged in!" });
    }
})

router.put('/me', verifyToken, async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token)
            return res.status(401).send({ message: "You must be logged in!" });
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
        res.send(user);
    } catch (err) {
        console.log(err);
        res.status(401).send({ message: "You must be logged in!" });
    }
})

module.exports = router;
