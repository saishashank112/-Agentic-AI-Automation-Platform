const crypto = require('crypto');

class MemoryDbStore {
  constructor() {
    this.users = [];
    this.workflows = [];
    this.executions = [];
    this.executionLogs = [];
    this.integrations = [];
    this.notifications = [];
    this.agentMemories = [];
    this.approvalRequests = [];
    this.rootCauseAnalyses = [];
    this.healingOperations = [];
    this.simulations = [];
    this.policies = [];
  }

  generateId() {
    return crypto.randomBytes(12).toString('hex');
  }

  // Users
  async findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserById(id) {
    return this.users.find((u) => u._id.toString() === id.toString()) || null;
  }

  async createUser(userData) {
    const user = {
      _id: this.generateId(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  // Workflows
  async createWorkflow(wfData) {
    const wf = {
      _id: this.generateId(),
      version: 1,
      status: 'draft',
      nodes: [],
      edges: [],
      tags: [],
      triggerConfig: { type: 'manual' },
      ...wfData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.workflows.push(wf);
    return wf;
  }

  async findWorkflowsByUser(ownerId, search = '') {
    return this.workflows
      .filter((w) => w.owner.toString() === ownerId.toString())
      .filter((w) => !search || w.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async findWorkflowById(id, ownerId) {
    return this.workflows.find((w) => w._id.toString() === id.toString() && w.owner.toString() === ownerId.toString()) || null;
  }

  async updateWorkflow(id, ownerId, updates) {
    const idx = this.workflows.findIndex((w) => w._id.toString() === id.toString() && w.owner.toString() === ownerId.toString());
    if (idx === -1) return null;

    this.workflows[idx] = {
      ...this.workflows[idx],
      ...updates,
      version: (this.workflows[idx].version || 1) + 1,
      updatedAt: new Date(),
    };
    return this.workflows[idx];
  }

  async deleteWorkflow(id, ownerId) {
    const idx = this.workflows.findIndex((w) => w._id.toString() === id.toString() && w.owner.toString() === ownerId.toString());
    if (idx === -1) return null;
    const removed = this.workflows[idx];
    this.workflows.splice(idx, 1);
    return removed;
  }

  // Executions
  async createExecution(execData) {
    const exec = {
      _id: this.generateId(),
      status: 'PENDING',
      retryCount: 0,
      inputs: {},
      outputs: {},
      duration: 0,
      startTime: new Date(),
      ...execData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.executions.push(exec);
    return exec;
  }

  async findExecutionsByUser(ownerId) {
    const userWfIds = this.workflows.filter((w) => w.owner.toString() === ownerId.toString()).map((w) => w._id.toString());
    return this.executions
      .filter((e) => userWfIds.includes(e.workflowId._id ? e.workflowId._id.toString() : e.workflowId.toString()))
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async findExecutionById(id) {
    return this.executions.find((e) => e._id.toString() === id.toString()) || null;
  }

  async updateExecution(id, updates) {
    const idx = this.executions.findIndex((e) => e._id.toString() === id.toString());
    if (idx === -1) return null;

    this.executions[idx] = {
      ...this.executions[idx],
      ...updates,
      updatedAt: new Date(),
    };
    return this.executions[idx];
  }

  // ExecutionLogs
  async createExecutionLog(logData) {
    const log = {
      _id: this.generateId(),
      timestamp: new Date(),
      level: 'info',
      ...logData,
      createdAt: new Date(),
    };
    this.executionLogs.push(log);
    return log;
  }

  async findLogsByExecution(executionId) {
    return this.executionLogs
      .filter((l) => l.executionId.toString() === executionId.toString())
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  // Integrations
  async findIntegrationsByUser(ownerId) {
    return this.integrations.filter((i) => i.owner.toString() === ownerId.toString());
  }

  async upsertIntegration(ownerId, provider, data) {
    let idx = this.integrations.findIndex((i) => i.owner.toString() === ownerId.toString() && i.provider === provider);
    if (idx !== -1) {
      this.integrations[idx] = { ...this.integrations[idx], ...data, updatedAt: new Date() };
      return this.integrations[idx];
    } else {
      const item = { _id: this.generateId(), owner: ownerId, provider, isConnected: true, ...data, createdAt: new Date(), updatedAt: new Date() };
      this.integrations.push(item);
      return item;
    }
  }

  // Notifications
  async createNotification(notifData) {
    const notif = { _id: this.generateId(), isRead: false, type: 'info', ...notifData, createdAt: new Date() };
    this.notifications.push(notif);
    return notif;
  }

  async findNotificationsByUser(ownerId) {
    return this.notifications
      .filter((n) => n.owner.toString() === ownerId.toString())
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  // ApprovalRequests
  async createApprovalRequest(data) {
    const req = { _id: this.generateId(), status: 'PENDING', ...data, createdAt: new Date() };
    this.approvalRequests.push(req);
    return req;
  }
  async findApprovalRequests(query = {}) {
    return this.approvalRequests
      .filter((r) => !query.status || r.status === query.status)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  async findApprovalRequestById(id) {
    return this.approvalRequests.find((r) => r._id.toString() === id.toString()) || null;
  }
  async updateApprovalRequest(id, updates) {
    const idx = this.approvalRequests.findIndex((r) => r._id.toString() === id.toString());
    if (idx !== -1) {
      this.approvalRequests[idx] = { ...this.approvalRequests[idx], ...updates, updatedAt: new Date() };
      return this.approvalRequests[idx];
    }
    return null;
  }

  // RootCauseAnalyses
  async createRootCauseAnalysis(data) {
    const rca = { _id: this.generateId(), ...data, createdAt: new Date() };
    this.rootCauseAnalyses.push(rca);
    return rca;
  }
  async findRootCauseByExecution(executionId) {
    return this.rootCauseAnalyses.find((r) => r.executionId.toString() === executionId.toString()) || null;
  }

  // HealingOperations
  async createHealingOperation(data) {
    const op = { _id: this.generateId(), status: 'PROPOSED', ...data, createdAt: new Date() };
    this.healingOperations.push(op);
    return op;
  }
  async findHealingOperationsByExecution(executionId) {
    return this.healingOperations.filter((h) => h.executionId.toString() === executionId.toString());
  }
  async findHealingOperationById(id) {
    return this.healingOperations.find((h) => h._id.toString() === id.toString()) || null;
  }
  async updateHealingOperation(id, updates) {
    const idx = this.healingOperations.findIndex((h) => h._id.toString() === id.toString());
    if (idx !== -1) {
      this.healingOperations[idx] = { ...this.healingOperations[idx], ...updates, updatedAt: new Date() };
      return this.healingOperations[idx];
    }
    return null;
  }

  // Simulations
  async createSimulation(data) {
    const sim = { _id: this.generateId(), mode: 'SIMULATION', ...data, createdAt: new Date() };
    this.simulations.push(sim);
    return sim;
  }
  async findSimulationsByWorkflow(workflowId) {
    return this.simulations
      .filter((s) => s.workflowId.toString() === workflowId.toString())
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  async findSimulationById(id) {
    return this.simulations.find((s) => s._id.toString() === id.toString()) || null;
  }

  // Policies
  async createPolicy(ownerId, data) {
    const pol = { _id: this.generateId(), owner: ownerId, enabled: true, ...data, createdAt: new Date() };
    this.policies.push(pol);
    return pol;
  }
  async findPoliciesByUser(ownerId) {
    return this.policies.filter((p) => p.owner.toString() === ownerId.toString());
  }
  async updatePolicy(id, ownerId, updates) {
    const idx = this.policies.findIndex((p) => p._id.toString() === id.toString() && p.owner.toString() === ownerId.toString());
    if (idx !== -1) {
      this.policies[idx] = { ...this.policies[idx], ...updates, updatedAt: new Date() };
      return this.policies[idx];
    }
    return null;
  }
  async deletePolicy(id, ownerId) {
    const idx = this.policies.findIndex((p) => p._id.toString() === id.toString() && p.owner.toString() === ownerId.toString());
    if (idx !== -1) {
      const removed = this.policies[idx];
      this.policies.splice(idx, 1);
      return removed;
    }
    return null;
  }
}

module.exports = new MemoryDbStore();
