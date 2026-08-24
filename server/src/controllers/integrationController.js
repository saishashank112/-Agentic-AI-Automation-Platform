const integrationService = require('../services/integrationService');
const env = require('../config/env');

const getIntegrations = async (req, res) => {
  try {
    const list = await integrationService.listUserIntegrations(req.user.id);
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getStatus = async (req, res) => {
  try {
    const list = await integrationService.listUserIntegrations(req.user.id);
    const health = {
      openRouterKeySet: !!env.OPENROUTER_API_KEY,
      geminiKeySet: !!env.GEMINI_API_KEY,
      redisConnected: !!env.REDIS_URL,
      encryptionKeyConfigured: !!env.CREDENTIAL_ENCRYPTION_KEY,
      integrations: list,
    };
    res.status(200).json({ success: true, data: health });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const startOAuth = async (req, res) => {
  try {
    const { provider } = req.params;
    const instance = integrationService.getIntegrationInstance(provider);
    if (!instance) {
      return res.status(400).json({ success: false, error: 'Invalid integration provider' });
    }

    const redirectUri = `${env.CLIENT_URL}/integrations?provider=${provider}&status=success`;
    const url = instance.getOAuthStartUrl(redirectUri, req.user.id.toString());
    res.status(200).json({ success: true, url, redirectUri });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const handleCallback = async (req, res) => {
  try {
    const { provider } = req.params;
    const { code } = req.query;

    const instance = integrationService.getIntegrationInstance(provider);
    if (!instance) {
      return res.redirect(`${env.CLIENT_URL}/integrations?status=error&message=InvalidProvider`);
    }

    const tokens = await instance.handleOAuthCallback(code, `${env.CLIENT_URL}/integrations`);
    await integrationService.saveCredentials(req.user.id, provider, tokens);

    res.redirect(`${env.CLIENT_URL}/integrations?status=success&provider=${provider}`);
  } catch (err) {
    res.redirect(`${env.CLIENT_URL}/integrations?status=error&message=${encodeURIComponent(err.message)}`);
  }
};

const saveManualCredentials = async (req, res) => {
  try {
    const { provider, credentials } = req.body;
    if (!provider || !credentials) {
      return res.status(400).json({ success: false, error: 'Provider and credentials required' });
    }
    const saved = await integrationService.saveCredentials(req.user.id, provider, credentials);
    res.status(200).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  getIntegrations,
  getStatus,
  startOAuth,
  handleCallback,
  saveManualCredentials,
};
