class HealingAgent {
  async proposeHealing(execution, failedNode, rcaResult) {
    const originalConfig = failedNode ? JSON.parse(JSON.stringify(failedNode)) : {};
    let proposedConfig = JSON.parse(JSON.stringify(originalConfig));
    let strategy = rcaResult.recommendedAction || 'REMAP_FIELDS';
    let confidence = rcaResult.confidence || 0.92;
    let requiresApproval = rcaResult.requiresHumanApproval || false;
    let patch = {};

    if (strategy === 'REMAP_FIELDS') {
      patch = {
        nodeId: failedNode.id,
        changes: {
          fieldMapping: { invoice_amount: '{{previous.amount}}' },
          repairedAt: new Date().toISOString(),
        },
      };
      proposedConfig.data = {
        ...proposedConfig.data,
        fieldMapping: { invoice_amount: '{{previous.amount}}' },
        prompt: `[Self-Healed Mapping] ${proposedConfig.data?.prompt || ''} Map amount -> invoice_amount`,
      };
    } else if (strategy === 'REFRESH_AUTH') {
      patch = {
        nodeId: failedNode.id,
        changes: {
          credentials: { accessToken: `refreshed_oauth_token_${Date.now()}` },
        },
      };
      proposedConfig.data = {
        ...proposedConfig.data,
        credentials: { accessToken: `refreshed_oauth_token_${Date.now()}` },
      };
      requiresApproval = true;
    } else {
      patch = {
        nodeId: failedNode.id,
        changes: {
          retryStrategy: 'exponential_backoff_3x',
        },
      };
    }

    // Determine Partial Re-execution Subgraph
    const workflow = execution.workflowSnapshot || execution.workflowId;
    const nodes = workflow.nodes || [];
    const edges = workflow.edges || [];

    const failedIdx = nodes.findIndex((n) => n.id === failedNode.id);
    const affectedSubgraph = failedIdx !== -1 ? nodes.slice(failedIdx) : [failedNode];

    return {
      executionId: execution._id || execution.id,
      workflowId: execution.workflowId._id || execution.workflowId,
      nodeId: failedNode.id,
      strategy,
      confidence,
      originalConfig,
      proposedConfig,
      patch,
      status: 'PROPOSED',
      requiresApproval,
      reexecutionType: 'PARTIAL_REEXECUTION',
      nodesRecovered: affectedSubgraph.length,
      affectedSubgraph,
    };
  }
}

module.exports = new HealingAgent();
