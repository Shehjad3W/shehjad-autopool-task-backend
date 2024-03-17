const User = require('../schemas/usersSchema');

async function generateUniqueUsername() {
    let count = 1;
    let username = `U${count}`;
    let user = await User.findOne({ username });

    // Find an unused username
    while (user) {
        count++;
        username = `U${count}`;
        user = await User.findOne({ username });
    }

    return username;
}

module.exports = generateUniqueUsername;