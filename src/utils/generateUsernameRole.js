const User = require('../schemas/usersSchema');

async function generateUsernameRole() {
    let count = 1;
    let username = `U${count}`;
    let user = await User.findOne({ username });

    // Find an unused username
    while (user) {
        count++;
        username = `U${count}`;
        user = await User.findOne({ username });
    }

    // Give role
    let role = 'A1';
    if (count > 1 && count <= 4) {
        role = 'A2underU1';
    } else if (count > 4 && count <= 13) {
        count -= 4;
        if (count <= 3) {
            role = 'A3underU2';
        } else if (count <= 6) {
            role = 'A3underU3';
        } else if (count <= 9) {
            role = 'A3underU4';
        }
    }

    return { username, role };
}

module.exports = generateUsernameRole;