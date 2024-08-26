/**
 * Description: This file is used to create the chat Schema and Model
 */

// Import Mongoose
const mongoose = require('mongoose');

// Create the chat Schema
const chatSchema = new mongoose.Schema({
    members: Array,
}, {

    timestamps: true,
});

// Create the chat Model from the chat Schema
const chatModel = mongoose.model("Chat", chatSchema);

// Export the chat Model to be used in the controller
module.exports = chatModel;