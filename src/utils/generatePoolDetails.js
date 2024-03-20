const User = require('../schemas/usersSchema');

function getAdminSerial(poolSerial) {
    let adminSerial = Math.ceil(poolSerial / 3);
    if (poolSerial === 1) adminSerial = 0;

    if ((poolSerial - 1) % 3 === 0 && poolSerial > 1) {
        adminSerial--;
    }

    return adminSerial;
}

async function generatePoolDetails() {
    let poolSerial = 1; // Initialize poolSerial
    let user = await User.findOne({ 'poolDetails.poolSerial': poolSerial }); // Initial query
    while (user) {
        poolSerial++; // Increment poolSerial
        user = await User.findOne({ 'poolDetails.poolSerial': poolSerial }); // Check for existence of next poolSerial
    }

    const adminSerial = getAdminSerial(poolSerial);
    const poolDetails = { poolSerial, adminSerial };

    return poolDetails;
}

module.exports = generatePoolDetails;
