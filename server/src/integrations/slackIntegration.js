const BaseIntegration = require('./baseIntegration');

class SlackIntegration extends BaseIntegration {
  constructor() {
    super('slack');
  }

  async validateCredentials(credentials) {
    if (!credentials || (!credentials.accessToken && !credentials.botToken)) {
      return { valid: false, error: 'INTEGRATION_NOT_CONNECTED' };
    }
    return { valid: true };
  }

  async executeAction(action, payload, credentials) {
    const val = await this.validateCredentials(credentials);
    if (!val.valid) {
      throw new Error(val.error);
    }

    switch (action) {
      case 'post_message':
        return {
          status: 'success',
          channel: payload.channel || '#general',
          text: payload.message || 'Notification from Agentflow AI',
          ts: `${Date.now() / 1000}`,
        };

      default:
        return { status: 'success', result: `Slack action ${action} executed`, payload };
    }
  }
}

module.exports = new SlackIntegration();
