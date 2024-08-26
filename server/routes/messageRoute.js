/**
 * Description: Exports the message routes to be used in the server.
 */

// Import and Initialize express router
const express = require("express");
const router = express.Router();

// Import API methods from messageController
const { createMessage, findChatMessages } = require("../controllers/messageController");

// Message Routes (Endpoints)
router.post("/", createMessage);
router.get("/:chatId", findChatMessages);

// Export the router to be used in index.js
module.exports = router;