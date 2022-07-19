const mongoose = require('mongoose');


const connect = async() => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("CONNECT SUCCESS !");
    } catch (error) {
        console.log("CONNECT FAILES !");
    }
}

module.exports = { connect }