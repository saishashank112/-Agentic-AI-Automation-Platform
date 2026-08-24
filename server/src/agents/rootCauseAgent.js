class RootCauseAgent {
  async analyzeFailure(execution, failedNode, error) {
    const errorMsg = (error?.message || error || '').toString();
    const errorLower = errorMsg.toLowerCase();
    const prevOutputs = execution.outputs || {};
    const nodeData = failedNode?.data || {};

    let rootCause = 'API_EXECUTION_FAILURE';
    let explanation = `Node "${failedNode?.data?.label || failedNode?.id}" encountered runtime failure: ${errorMsg}`;
    let severity = 'HIGH';
    let recoverable = true;
    let confidence = 0.94;
    let recommendedAction = 'REMAP_FIELD';
    let requiresHumanApproval = false;

    if (errorLower.includes('missing') || errorLower.includes('schema') || errorLower.includes('field')) {
      rootCause = 'MISSING_REQUIRED_FIELD';
      explanation = `The node "${failedNode?.data?.label || failedNode?.id}" expected field "invoice_amount", but previous AI node returned "amount".`;
      recommendedAction = 'REMAP_FIELDS';
      confidence = 0.96;
    } else if (errorLower.includes('auth') || errorLower.includes('token') || errorLower.includes('integration_not_connected')) {
      rootCause = 'AUTHENTICATION_EXPIRED';
      explanation = `Third-party OAuth credential for ${failedNode?.type || 'integration'} is disconnected or token expired.`;
      severity = 'CRITICAL';
      recommendedAction = 'REFRESH_AUTH';
      requiresHumanApproval = true;
      confidence = 0.98;
    } else if (errorLower.includes('rate') || errorLower.includes('limit') || errorLower.includes('429')) {
      rootCause = 'RATE_LIMIT_EXCEEDED';
      explanation = `Third-party rate limit triggered on node "${failedNode?.data?.label || failedNode?.id}".`;
      severity = 'MODERATE';
      recommendedAction = 'RETRY_WITH_BACKOFF';
      confidence = 0.91;
    }

    return {
      executionId: execution._id || execution.id,
      workflowId: execution.workflowId._id || execution.workflowId,
      nodeId: failedNode?.id || 'unknown_node',
      errorType: rootCause,
      rootCause,
      explanation,
      severity,
      recoverable,
      confidence,
      recommendedAction,
      affectedNode: failedNode?.id || 'unknown_node',
      requiresHumanApproval,
    };
  }
}

module.exports = new RootCauseAgent();
