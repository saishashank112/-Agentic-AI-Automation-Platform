const BaseIntegration = require('./baseIntegration');

class GmailIntegration extends BaseIntegration {
  constructor() {
    super('gmail');
  }

  async validateCredentials(credentials) {
    if (!credentials || (!credentials.accessToken && !credentials.apiKey)) {
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
      case 'send_email':
        return {
          status: 'success',
          messageId: `msg_${Date.now()}`,
          recipient: payload.to || 'user@example.com',
          subject: payload.subject || 'Automation Notification',
          sentAt: new Date().toISOString(),
        };

      case 'read_mail':
        return {
          status: 'success',
          messages: [
            {
              id: `msg_inbox_1`,
              from: 'client@example.com',
              subject: payload.query || 'Invoice Processing',
              body: 'Please process the attached invoice #1042',
              receivedAt: new Date().toISOString(),
            },
          ],
        };

      default:
        return { status: 'success', result: `Gmail action ${action} executed successfully`, payload };
    }
  }
}

module.exports = new GmailIntegration();
