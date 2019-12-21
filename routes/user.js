const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    
    id: String,
    password: String,
    name: String,
    date: Date
    
});
module.exports = mongoose.model('User', userSchema);