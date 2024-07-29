const Task = require('../models/Task');

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createTask = async (req, res) => {
    const { title, description, category } = req.body;
    try {
        const task = await Task.create({
            user: req.user._id,
            title,
            description,
            category,
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    const { title, description, category, status } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.category = category || task.category;
        task.status = status || task.status;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await task.remove();
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
