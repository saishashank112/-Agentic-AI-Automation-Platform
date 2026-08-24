const notificationService = require('../services/notificationService');

const getNotifications = async (req, res) => {
  try {
    const list = await notificationService.getUserNotifications(req.user.id);
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const markRead = async (req, res) => {
  try {
    const notif = await notificationService.markAsRead(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: notif });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const sendTestNotification = async (req, res) => {
  try {
    const notif = await notificationService.createNotification(
      req.user.id,
      '⚡ Test System Alert',
      'Agentic Substrate & Telemetry Engine is fully operational.',
      'info'
    );
    res.status(201).json({ success: true, data: notif });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  getNotifications,
  markRead,
  markAllRead,
  sendTestNotification,
};
