const BaseIntegration = require('./baseIntegration');

class DiscordIntegration extends BaseIntegration {
  constructor() {
    super('discord');
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
          channelId: payload.channelId || 'discord-general-channel',
          content: payload.content || payload.message || 'Automated message via Agentflow AI Bot',
          id: `discord_msg_${Date.now()}`,
        };

      default:
        return { status: 'success', result: `Discord action ${action} executed`, payload };
    }
  }
}

module.exports = new DiscordIntegration();
