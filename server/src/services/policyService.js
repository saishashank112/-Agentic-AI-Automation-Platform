const mongoose = require('mongoose');
const Policy = require('../models/Policy');
const memDb = require('../config/memDb');

const getPolicies = async (userId) => {
  if (mongoose.connection.readyState === 1) {
    return await Policy.find({ owner: userId }).sort({ priority: 1, createdAt: -1 });
  } else {
    return await memDb.findPoliciesByUser(userId);
  }
};

const createPolicy = async (userId, data) => {
  if (mongoose.connection.readyState === 1) {
    return await Policy.create({ owner: userId, ...data });
  } else {
    return await memDb.createPolicy(userId, data);
  }
};

const updatePolicy = async (id, userId, updates) => {
  if (mongoose.connection.readyState === 1) {
    return await Policy.findOneAndUpdate({ _id: id, owner: userId }, updates, { new: true });
  } else {
    return await memDb.updatePolicy(id, userId, updates);
  }
};

const deletePolicy = async (id, userId) => {
  if (mongoose.connection.readyState === 1) {
    return await Policy.findOneAndDelete({ _id: id, owner: userId });
  } else {
    return await memDb.deletePolicy(id, userId);
  }
};

module.exports = {
  getPolicies,
  createPolicy,
  updatePolicy,
  deletePolicy,
};
