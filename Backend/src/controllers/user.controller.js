import Task from '../models/Task.models.js';
import User from '../models/User.models.js';

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        // Add task count to each user
        const usersWithTaskCount = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: 'pending' });
            const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: 'in-progress' });
            const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: 'completed' });
            return {    
                ...user._doc,
                pendingTasks,
                inProgressTasks,
                completedTasks
            };
        }));
        res.status(200).json(usersWithTaskCount);
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}


export { getUsers, getUserById, };