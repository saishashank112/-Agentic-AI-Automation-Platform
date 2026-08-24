class BaseIntegration {
  constructor(providerName) {
    this.providerName = providerName;
  }

  async validateCredentials(credentials) {
    throw new Error(`validateCredentials method not implemented for ${this.providerName}`);
  }

  async executeAction(action, payload, credentials) {
    throw new Error(`executeAction method not implemented for ${this.providerName}`);
  }

  getOAuthStartUrl(redirectUri, state) {
    return `https://auth.example.com/oauth/${this.providerName}?redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  }

  async handleOAuthCallback(code, redirectUri) {
    return {
      accessToken: `mock_access_token_${this.providerName}_${Date.now()}`,
      refreshToken: `mock_refresh_token_${this.providerName}_${Date.now()}`,
      expiresIn: 3600,
      scope: 'default',
    };
  }
}

module.exports = BaseIntegration;
