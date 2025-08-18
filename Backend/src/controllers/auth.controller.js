import User from "../models/User.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    )
}

const registerUser = async (req, res) => {
    try {
        const {name, email, password, profileImageUrl, adminInviteToken} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        // Determine user role: Admin if correct invite token is provided, otherwise Member
        let role = "member";

        if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
            role = "admin";
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashPassword,
            profileImageUrl,
            role
        });

        // Save user to the database
        await user.save();

        const token = generateToken(user._id);
        res.cookie('token', token);
        res.status(201).json({token, user})

    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({message: "Invalid email and password"});
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched) {
            return res.status(401).json({message: "Invalid email and password"});
        }

        const token = generateToken(user._id);
        res.status(200).json({token, user});

    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; 
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const {name, email, profileImageUrl} = req.body;
        // Update user details
        user.name = name || user.name;
        user.email = email || user.email;
        user.profileImageUrl = profileImageUrl || user.profileImageUrl;

        if( req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();
        const token = generateToken(updatedUser._id);
        res.status(200).json({message: "Profile updated successfully", token,updatedUser});

    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

export {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
}
