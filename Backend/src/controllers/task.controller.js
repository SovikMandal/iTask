import Task from '../models/Task.models.js';

const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};

        if (status) {
            filter.status = status;
        }

        let tasks;
        if (req.user.role === 'admin') {
            tasks = await Task.find(filter)
                .populate('assignedTo', 'name email profileImageUrl')
        } else {
            tasks = await Task.find({...filter, assignedTo: req.user._id }).populate('assignedTo', 'name email profileImageUrl');
        }

        tasks = await Promise.all(
            tasks = tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter(
                    (item) => item.isCompleted
                ).length;

                return {...task._doc, completedTodoCount: completedCount}
            })
        )

        const allTasks = await Task.countDocuments(
            req.user.role === 'admin' ? {} : { assignedTo: req.user._id }
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: 'pending',
            ...(req.user.role !== 'admin' && { assignedTo: req.user._id })
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: 'in-progress',
            ...(req.user.role !== 'admin' && { assignedTo: req.user._id })
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: 'completed',
            ...(req.user.role !== 'admin' && { assignedTo: req.user._id })
        });

        res.status(200).json({
            message: 'Tasks fetched successfully',
            tasks,
            statusSummary: {
                allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email profileImageUrl');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task fetched successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const createTasks = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            status,
            dueDate,
            assignedTo,
            createdBy,
            attachments,
            todoChecklist
        } = req.body;

        if(!Array.isArray(assignedTo)) {
            return res.status(400).json({ message: 'AssignedTo must be an array of user IDs' });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            status,
            dueDate,
            assignedTo,
            createdBy,
            attachments,
            todoChecklist
        });

        res.status(201).json({message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.attachments = req.body.attachments || task.attachments;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;

        if (req.body.assignedTo) {
            if(!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: 'AssignedTo must be an array of user IDs' });
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();
        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.deleteOne();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Ensure assignedTo is an array
        const assignedToArray = Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo];

        const isAssigned = assignedToArray.some(
            (userId) => userId.toString() === req.user._id.toString()
        );

        if (!isAssigned && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        task.status = req.body.status || task.status;

        if (task.status === 'completed') {
            task.todoChecklist.forEach(item => item.isCompleted = true);
            task.progress = 100;
        }

        const updatedTask = await task.save();
        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateTaskChecklist = async (req, res) => {
    try {
        const {todoChecklist} = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const assignedToArray = Array.isArray(task.assignedTo) ? task.assignedTo.map(String) : [String(task.assignedTo)];

        if(!assignedToArray.includes(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        task.todoChecklist = todoChecklist;

        const completedCount = task.todoChecklist.filter(item => item.isCompleted).length;

        const totalItems = task.todoChecklist.length;
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        if (task.progress === 100) {
            task.status = 'Completed';
        } else if (task.progress > 0) {
            task.status = 'In Progress';
        } else {
            task.status = 'Pending';
        }

        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate('assignedTo', 'name email profileImageUrl');

        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getDashboardData = async (req, res) => {
    try {
        const totalTask = await Task.countDocuments();
        const completedTask = await Task.countDocuments({ status: 'Completed' });
        const pendingTask = await Task.countDocuments({ status: 'Pending' });
        const overdueTask = await Task.countDocuments({
            status: { $ne: 'Completed' },
            dueDate: { $lt: new Date() }
        });

        const taskStatus = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const taskDistribution = taskStatus.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, '_');
            acc[formattedKey] = taskDistributionRaw.find(item => item._id === status)?.
            count || 0;
            return acc;
        }, {});

        taskDistribution["All"] = totalTask;

        const taskPriority = ["High", "Medium", "Low"];
        const taskPriorityDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ]);

        const taskPriorityDistribution = taskPriority.reduce((acc, priority) => {
            acc[priority] = taskPriorityDistributionRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find().sort({ createdAt: -1 }).limit(10).select("title status priority dueDate createdAt");

        res.status(200).json({
            message: 'Recent tasks retrieved successfully',
            statistics: {
                totalTask,
                completedTask,
                pendingTask,
                overdueTask
            },

            charts: {
                taskDistribution,
                taskPriorityDistribution
            },
            recentTasks
        })

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        // Task counts
        const [totalTask, completedTask, pendingTask, overdueTask] = await Promise.all([
            Task.countDocuments({ assignedTo: userId }),
            Task.countDocuments({ assignedTo: userId, status: 'Completed' }),
            Task.countDocuments({ assignedTo: userId, status: 'Pending' }),
            Task.countDocuments({
                assignedTo: userId,
                status: { $ne: 'Completed' },
                dueDate: { $exists: true, $ne: null, $lt: new Date() }
            })
        ]);

        // Status distribution
        const taskStatus = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);


        const taskDistribution = taskStatus.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, '_');
            acc[formattedKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
            return acc;
        }, {});
        
        taskDistribution["All"] = totalTask;

        // Priority distribution
        const taskPriority = ["High", "Medium", "Low"];
        const taskPriorityDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);
        const taskPriorityDistribution = taskPriority.reduce((acc, priority) => {
            acc[priority] = taskPriorityDistributionRaw.find(item => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // Recent tasks (fixed to filter by userId)
        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
            message: 'Dashboard data retrieved successfully',
            statistics: {
                totalTask,
                completedTask,
                pendingTask,
                overdueTask
            },
            charts: {
                taskDistribution,
                taskPriorityDistribution
            },
            recentTasks
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


export {
    getTasks,
    getTaskById,
    createTasks,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData
};