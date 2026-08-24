const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const env = require('./config/env');
const { connectDB } = require('./config/db');
const { initSocket } = require('./config/socket');

const authRoutes = require('./routes/authRoutes');
const workflowRoutes = require('./routes/workflowRoutes');
const executionRoutes = require('./routes/executionRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const healingRoutes = require('./routes/healingRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const policyRoutes = require('./routes/policyRoutes');
const optimizerRoutes = require('./routes/optimizerRoutes');

const app = express();
const server = http.createServer(app);

// Security & Utility Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Socket.IO Init
initSocket(server);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Agentic AI Automation Platform (Agentflow_AI) Server',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/executions', executionRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', simulationRoutes);
app.use('/api', healingRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/optimizations', optimizerRoutes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Start Server & Connect Database
const startServer = async () => {
  server.listen(env.PORT, () => {
    console.log(`🚀 Agentflow AI Server listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
  connectDB().catch((err) => console.error('DB Async Connection Error:', err.message));
};

startServer();

module.exports = { app, server };
