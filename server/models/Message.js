import mongoose from "mongoose";

// Define the message schema
const messageSchema = new mongoose.Schema(
    {
        // Reference to the sender user
        sender: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        // Reference to the receiver user
        receiver: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        // Text content of the message (optional)
        text: { 
            type: String, 
            default: "" // Default to an empty string if no text is provided
        },
        // Image URL for the message (optional)
        image: { 
            type: String, 
            default: "" // Default to an empty string if no image is provided
        },
        // Mark whether the message has been seen
        seen: { 
            type: Boolean, 
            default: false 
        },
    }, 
    { 
        timestamps: true // Automatically add createdAt and updatedAt fields
    }
);

// Define the Message model
const Message = mongoose.model("Message", messageSchema);

// Export the model (not the schema)
export default Message;