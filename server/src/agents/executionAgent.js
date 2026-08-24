const integrationService = require('../services/integrationService');

class ExecutionAgent {
  async executeNode(node, inputs, userId) {
    const nodeType = node.type || 'ai-agent';
    const data = node.data || {};

    switch (nodeType) {
      case 'trigger':
        return {
          status: 'success',
          output: {
            triggeredAt: new Date().toISOString(),
            payload: inputs || { event: 'manual_trigger' },
          },
        };

      case 'ai-agent':
        return {
          status: 'success',
          output: {
            aiResponse: `[AI Agent ${data.label || node.id}] Processed text successfully with model ${data.model || 'gpt-4o-mini'}.`,
            summary: `Executed AI task: ${data.prompt || 'Default processing'}`,
            timestamp: new Date().toISOString(),
          },
        };

      case 'gmail':
        const gmailRes = await integrationService.executeIntegrationAction(
          userId,
          'gmail',
          data.action || 'send_email',
          { to: data.recipient || 'recipient@company.com', subject: data.label, body: inputs.summary || 'Automation payload' }
        );
        return { status: 'success', output: gmailRes };

      case 'slack':
        const slackRes = await integrationService.executeIntegrationAction(
          userId,
          'slack',
          data.action || 'post_message',
          { channel: data.channel || '#general', message: data.label || 'Workflow automated post' }
        );
        return { status: 'success', output: slackRes };

      case 'discord':
        const discordRes = await integrationService.executeIntegrationAction(
          userId,
          'discord',
          data.action || 'post_message',
          { channelId: data.channelId || 'general', message: data.label || 'Discord automated post' }
        );
        return { status: 'success', output: discordRes };

      case 'google-sheets':
        const sheetRes = await integrationService.executeIntegrationAction(
          userId,
          'google-sheets',
          data.action || 'append_row',
          { spreadsheetId: data.spreadsheetId || 'default_sheet', values: [node.id, data.label, new Date().toISOString()] }
        );
        return { status: 'success', output: sheetRes };

      default:
        return {
          status: 'success',
          output: { result: `Executed generic node type ${nodeType}`, timestamp: new Date().toISOString() },
        };
    }
  }
}

module.exports = new ExecutionAgent();
