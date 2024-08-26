/**
 * Description: Contains the APIs to register a new user, 
 * login a registered user, get a user by ID and get all users.
 */

// Import user model
const userModel = require('../models/userModel');

// Import dependencies
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { get } = require('mongoose');

// Function to create a token
const createToken = (_id) => {
    const jwtKey = process.env.JWT_KEY;
    return jwt.sign({_id}, jwtKey, {expiresIn: '3d'});
};

// API to register a new user
const registerUser = async (req, res) => {
    // Get user input
    const {name, email, password} = req.body;

    try {
        // Validate user input    
        if (!name || !email || !password) {
            return res.status(400).json({message: 'All fields are required'});
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({message: 'Invalid email'});
        }

        let user = await userModel.findOne({email});
        if (user) {
            return res.status(400).json({message: 'User already exists'});
        }
        
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({message: 'Password is not strong enough'});
        }

        // Create a new user and save to database
        user = new userModel({name, email, password});
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // Create a token
        const token = createToken(user._id);
        res.status(200).json({_id: user._id, name: user.name, email: user.email, userToken: token, message: 'Registration successful'});
    }catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    };
};

// API to login a registered user
const loginUser = async (req, res) => {
    // Get user input
    const {email, password} = req.body;

    try {
        // Validate user input
        if (!email || !password) {
            return res.status(400).json({message: 'All fields are required'});
        };

        let user = await userModel.findOne({email});
        if (!user) {
            return res.status(400).json({message: 'Invalid credentials'});
        };

        // Validate password
        let isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({message: 'Invalid credentials'});
        };

        // Create a token
        const token = createToken(user._id);
        res.status(200).json({_id: user._id, name: user.name, email: user.email, userToken: token, message: 'Login successful'});
    }catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

// API to get a user by ID
const getUser = async (req, res) => {
    try {
        // Get user ID
        const userId = req.params.userId;

        // Find user by ID
        const user = await userModel.findById(userId);

        // Return user if found
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        };
        res.status(200).json(user);
    }catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    };
}

// API to get all users
const getAllUsers = async (req, res) => {
    try {
        // Find all users
        const users = await userModel.find();
        // Return users
        res.status(200).json(users);
    }catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    };
};

// Export the API methods to be used in userRoute.js
module.exports = { registerUser, loginUser, getUser, getAllUsers };