/**
 * Description: this file is used to create the messages Schema and Model
 */

// Import Mongoose
const mongoose = require('mongoose');

// Create the message Schema
const messageSchema = mongoose.Schema({
    chatId: String,
    senderId: String,
    text: String
}, 
{
    timestamps: true
});

// Create the message Model from the message Schema
const messageModel = mongoose.model("Message", messageSchema);

// Export the message Model to be used in the controller
module.exports = messageModel;