const BaseIntegration = require('./baseIntegration');

class GoogleSheetsIntegration extends BaseIntegration {
  constructor() {
    super('google-sheets');
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
      case 'append_row':
        return {
          status: 'success',
          spreadsheetId: payload.spreadsheetId || 'sheet_12345',
          updatedRange: payload.range || 'Sheet1!A:D',
          updatedRows: 1,
          appendedValues: payload.values || ['Sample Data', new Date().toISOString()],
        };

      case 'read_range':
        return {
          status: 'success',
          spreadsheetId: payload.spreadsheetId || 'sheet_12345',
          range: payload.range || 'Sheet1!A1:D10',
          values: [
            ['ID', 'Name', 'Status', 'Date'],
            ['1', 'Task A', 'Completed', new Date().toISOString()],
          ],
        };

      default:
        return { status: 'success', result: `Google Sheets action ${action} executed`, payload };
    }
  }
}

module.exports = new GoogleSheetsIntegration();
