const crypto = require('crypto');
const mongoose = require('mongoose');
const Integration = require('../models/Integration');
const memDb = require('../config/memDb');
const env = require('../config/env');

const gmailIntegration = require('../integrations/gmailIntegration');
const slackIntegration = require('../integrations/slackIntegration');
const discordIntegration = require('../integrations/discordIntegration');
const googleSheetsIntegration = require('../integrations/googleSheetsIntegration');

const getIntegrationInstance = (provider) => {
  switch (provider) {
    case 'gmail':
      return gmailIntegration;
    case 'slack':
      return slackIntegration;
    case 'discord':
      return discordIntegration;
    case 'google-sheets':
      return googleSheetsIntegration;
    default:
      return null;
  }
};

const getKey = () => {
  let keyHex = env.CREDENTIAL_ENCRYPTION_KEY || '';
  if (keyHex.length < 64) {
    keyHex = keyHex.padEnd(64, '0');
  }
  return Buffer.from(keyHex.slice(0, 64), 'hex');
};

const encryptData = (dataObj) => {
  if (!dataObj) return null;
  const iv = crypto.randomBytes(16);
  const key = getKey();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(JSON.stringify(dataObj), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

const decryptData = (encryptedText) => {
  if (!encryptedText) return null;
  try {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedData = Buffer.from(textParts.join(':'), 'hex');
    const key = getKey();
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'utf8', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (err) {
    console.error('Failed to decrypt credentials:', err.message);
    return null;
  }
};

const listUserIntegrations = async (userId) => {
  const providers = ['gmail', 'slack', 'google-sheets', 'discord', 'openrouter', 'gemini'];
  let userIntegrations = [];

  if (mongoose.connection.readyState === 1) {
    userIntegrations = await Integration.find({ owner: userId });
  } else {
    userIntegrations = await memDb.findIntegrationsByUser(userId);
  }

  const result = providers.map((provider) => {
    const found = userIntegrations.find((item) => item.provider === provider);
    return {
      provider,
      isConnected: found ? found.isConnected : false,
      expiresAt: found ? found.expiresAt : null,
      updatedAt: found ? found.updatedAt : null,
    };
  });

  return result;
};

const saveCredentials = async (userId, provider, rawCredentials) => {
  const encrypted = encryptData(rawCredentials);
  if (mongoose.connection.readyState === 1) {
    const integration = await Integration.findOneAndUpdate(
      { owner: userId, provider },
      {
        owner: userId,
        provider,
        isConnected: true,
        encryptedTokens: encrypted,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      { upsert: true, new: true }
    );
    return { provider: integration.provider, isConnected: integration.isConnected };
  } else {
    const item = await memDb.upsertIntegration(userId, provider, {
      isConnected: true,
      encryptedTokens: encrypted,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    return { provider: item.provider, isConnected: item.isConnected };
  }
};

const getCredentials = async (userId, provider) => {
  let integration = null;
  if (mongoose.connection.readyState === 1) {
    integration = await Integration.findOne({ owner: userId, provider });
  } else {
    const items = await memDb.findIntegrationsByUser(userId);
    integration = items.find((i) => i.provider === provider) || null;
  }

  if (!integration || !integration.isConnected || !integration.encryptedTokens) {
    return null;
  }
  return decryptData(integration.encryptedTokens);
};

const executeIntegrationAction = async (userId, provider, action, payload) => {
  const instance = getIntegrationInstance(provider);
  if (!instance) {
    throw new Error(`Unsupported integration provider: ${provider}`);
  }

  let creds = await getCredentials(userId, provider);
  if (!creds) {
    creds = { accessToken: `demo_token_${provider}`, apiKey: `demo_key_${provider}` };
  }

  return await instance.executeAction(action, payload, creds);
};

module.exports = {
  listUserIntegrations,
  saveCredentials,
  getCredentials,
  executeIntegrationAction,
  getIntegrationInstance,
};
