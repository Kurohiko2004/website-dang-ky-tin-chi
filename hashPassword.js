// hashPassword.js
const bcrypt = require('bcryptjs');

async function hash() {
    const password = '123456';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
}
hash();