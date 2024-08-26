/**
 * Description: Exports the chat routes to be used in the server.
 */

// Import and Initialize express router
const express = require("express");
const router = express.Router();

// Import API methods from chatController
const { createChat, findUserChats, findChat } = require("../controllers/chatController");

// Chat Routes (Endpoints)
router.post("/", createChat);
router.get("/:userId", findUserChats);
router.get("/find/:firstUser/:secondUser", findChat);

// Export the router to be used in index.js
module.exports = router;