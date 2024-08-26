/**
 * Description: Contains the APIs to create a new message, get all messages in a chat.
 */

// Import message model
const messageModel = require('../models/messageModel');

// API to create a new message

const createMessage = async (req, res) => {
    // Get chatId, senderId and text from request body
    const { chatId, senderId, text } = req.body;

    try {

        // Create a new message, save to database and return the new message
        const newMessage = new messageModel({ chatId, senderId, text });
        const response = await newMessage.save();
        res.status(200).json(response);
    } catch (error) {
        // Handle errors
        console.log(error);
        res.status(500).json({ error });
    }
};

// API to get all messages in a chat
const findChatMessages = async (req, res) => {
    // Get chatId from request parameters
    const { chatId } = req.params;

    try {
        // Get all messages in the given chat
        const messages = await messageModel.find({ chatId });
        res.status(200).json(messages);
    } catch (error) {
        // Handle errors
        console.log(error);
        res.status(500).json({ error });
    }
};

// Export the APIs to be used in routes
module.exports = { createMessage, findChatMessages };