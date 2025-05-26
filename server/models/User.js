import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing

// Define the user schema
const userSchema = new mongoose.Schema(
    {
        // Email field (required, unique, with validation)
        email: { 
            type: String, 
            required: true, 
            unique: true, 
            validate: {
                validator: function(email) {
                    // Simple regex for email validation
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                },
                message: "Invalid email format",
            },
        },
        // Full name of the user (required)
        fullName: { 
            type: String, 
            required: true 
        },
        // Password field (required, with minimum length validation)
        password: { 
            type: String, 
            required: true, 
            minlength: 6 
        },
        // Profile picture URL (optional, with default)
        profilePic: { 
            type: String, 
            default: "https://example.com/default-profile-pic.png" // Placeholder image
        },
        // Bio field (optional)
        bio: { 
            type: String, 
            required: false 
        },
    }, 
    { 
        timestamps: true // Automatically add createdAt and updatedAt fields
    }
);

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Export the User model
export default User;