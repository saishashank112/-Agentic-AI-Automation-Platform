const env = require('../config/env');
const orchestrator = require('../agents/orchestrator');

let queue = null;
let useBullMQ = false;

if (env.REDIS_URL) {
  try {
    const { Queue, Worker } = require('bullmq');
    const IORedis = require('ioredis');

    const connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });
    queue = new Queue('workflow-execution-queue', { connection });

    new Worker(
      'workflow-execution-queue',
      async (job) => {
        const { executionId, userId } = job.data;
        console.log(`[BullMQ Worker] Processing execution ${executionId}`);
        await orchestrator.runExecution(executionId, userId);
      },
      { connection }
    );

    useBullMQ = true;
    console.log('✅ BullMQ Execution Queue connected to Redis');
  } catch (err) {
    console.warn('⚠️ BullMQ/Redis setup failed, switching to In-Memory Queue Fallback:', err.message);
    useBullMQ = false;
  }
} else {
  console.log('⚡ REDIS_URL not set. Operating with In-Memory Execution Queue Fallback.');
}

const addExecutionToQueue = async (executionId, userId) => {
  if (useBullMQ && queue) {
    await queue.add('execute_workflow', { executionId, userId });
  } else {
    // Immediate async processing fallback
    setImmediate(async () => {
      try {
        console.log(`[In-Memory Queue] Triggering async orchestrator run for execution ${executionId}`);
        await orchestrator.runExecution(executionId, userId);
      } catch (err) {
        console.error('[In-Memory Queue Error]', err.message);
      }
    });
  }
};

module.exports = {
  addExecutionToQueue,
};
