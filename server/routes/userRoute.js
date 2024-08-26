/**
 * Description: Exports the user routes to be used in the server.
 */

// Import and Initialize express router
const express = require("express");
const router = express.Router();

// Import API methods from userController
const { registerUser, loginUser, getUser, getAllUsers } = require("../controllers/userController");

// User Routes (Endpoints)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", getUser);
router.get("/", getAllUsers);

// Export the router to be used in index.js
module.exports = router;