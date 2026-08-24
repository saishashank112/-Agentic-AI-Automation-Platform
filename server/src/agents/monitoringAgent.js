const ExecutionLog = require('../models/ExecutionLog');
const { getIO } = require('../config/socket');

class MonitoringAgent {
  async logEvent(executionId, workflowId, agent, level, message, metadata = {}, nodeId = null) {
    try {
      const logEntry = await ExecutionLog.create({
        executionId,
        workflowId,
        nodeId,
        agent,
        level,
        message,
        metadata,
        timestamp: new Date(),
      });

      // Broadcast Socket.IO event to execution room
      const io = getIO();
      io.to(`execution:${executionId}`).emit('agent_event', {
        id: logEntry._id,
        executionId,
        workflowId,
        nodeId,
        agent,
        level,
        message,
        metadata,
        timestamp: logEntry.timestamp,
      });

      return logEntry;
    } catch (err) {
      console.error('MonitoringAgent log error:', err.message);
      return null;
    }
  }
}

module.exports = new MonitoringAgent();
