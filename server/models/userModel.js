/**
 * Description: This file is used to create the user schema and model.
 */

// Import mongoose
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, minlength: 3, maxlength: 15}, 
        email: {type: String, required: true, minlength: 6, maxlength: 45, unique: true},
        password: {type: String, required: true, minlength: 6, maxlength: 1024},
    }, 
    {
        timestamps: true,
    }
);

// Create a model from the schema
const userModel = mongoose.model("User", userSchema);

// Export the model to be used in the user controller
module.exports = userModel;