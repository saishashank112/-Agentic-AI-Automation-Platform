class ValidationAgent {
  async validate(node, result) {
    if (!result) {
      return { valid: false, errorType: 'MISSING_FIELDS', reason: 'Node execution returned null or undefined result.' };
    }

    if (result.status === 'error' || result.error) {
      const errMsg = result.error || 'Execution returned error status';
      if (errMsg.includes('INTEGRATION_NOT_CONNECTED')) {
        return { valid: false, errorType: 'AUTH_EXPIRED', reason: 'Third-party integration is not connected or token expired.' };
      }
      return { valid: false, errorType: 'API_FAILURE', reason: errMsg };
    }

    if (!result.output) {
      return { valid: false, errorType: 'MISSING_FIELDS', reason: 'Node execution output payload is missing.' };
    }

    return { valid: true };
  }
}

module.exports = new ValidationAgent();
