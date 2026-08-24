const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const memDb = require('../config/memDb');

const createNotification = async (owner, title, message, type = 'info', workflowId = null, executionId = null) => {
  try {
    if (mongoose.connection.readyState === 1) {
      return await Notification.create({
        owner,
        title,
        message,
        type,
        workflowId,
        executionId,
        isRead: false,
      });
    } else {
      return await memDb.createNotification({
        owner,
        title,
        message,
        type,
        workflowId,
        executionId,
        isRead: false,
      });
    }
  } catch (err) {
    console.error('Error creating notification:', err.message);
    return null;
  }
};

const getUserNotifications = async (owner) => {
  if (mongoose.connection.readyState === 1) {
    return await Notification.find({ owner }).sort({ createdAt: -1 }).limit(50);
  } else {
    return await memDb.findNotificationsByUser(owner);
  }
};

const markAsRead = async (id, owner) => {
  if (mongoose.connection.readyState === 1) {
    return await Notification.findOneAndUpdate({ _id: id, owner }, { isRead: true }, { new: true });
  } else {
    return await memDb.markNotificationRead(id, owner);
  }
};

const markAllAsRead = async (owner) => {
  if (mongoose.connection.readyState === 1) {
    return await Notification.updateMany({ owner }, { isRead: true });
  } else {
    const list = await memDb.findNotificationsByUser(owner);
    list.forEach((n) => (n.isRead = true));
    return { modifiedCount: list.length };
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
