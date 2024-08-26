/**
 * Description: Conrains the APIs to create a new chat, get all chats and get a chat by ID.
 */

// Import chat model
const chatModel = require('../models/chatModel');

// API to create a new chat
const createChat = async (req, res) => {
    const {firstUser, secondUser} = req.body;

    try{
        // Check if chat between the given users already exists
        const chat = await chatModel.findOne({members: {$all: [firstUser, secondUser]}});
        // If chat exists, return the chat
        if (chat) {
            return res.status(400).json(chat);
        }
        // If chat does not exist, create a new chat, save to database and return the new chat
        const newChat = new chatModel({members: [firstUser, secondUser]});
        const response = await newChat.save();
        res.status(200).json(response);

    }catch(error) {
        // Handle errors
        console.log(error);
        res.status(500).json({error});
    };
};

// API to get all chats
const findUserChats = async (req, res) => {
    const {userId} = req.params;

    try {
        // Get all chats where the given user is a member
        const chats = await chatModel.find({members: {$in: [userId]}});
        res.status(200).json(chats);

    } catch (error) {
        // Handle errors
        console.log(error);
        res.status(500).json({error});
    }
};

// API to get a chat by ID
const findChat = async (req, res) => {
    const { firstUser, secondUser } = req.params;

    try {
        // Get chat between the given users
        const chat = await chatModel.findOne({ members: { $all: [firstUser, secondUser] } });
        res.status(200).json(chat);
    } catch (error) {
        // Handle errors
        console.log(error);
        res.status(500).json({error});
    }
}; 

// Export the APIs
module.exports = { createChat, findUserChats, findChat };