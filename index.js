const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5500;
const cors = require('cors');
require('dotenv').config();

const userHandler = require('./src/routeHandler/userHandler');


// middleware
app.use(express.json())
app.use(cors({
    origin: [
        "http://localhost:5173",
        // "https://open-doors.surge.sh"
    ],
    credentials: true
}));

mongoose.connect(process.env.DB_URI)
    .then(() => { console.log("Connection successful.") })
    .catch((err) => { console.log(err) })




// routes
app.use('/users', userHandler);
app.use('/', (req, res) => {
    res.send("Auto Pool Server is running...");
})


// checking
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})