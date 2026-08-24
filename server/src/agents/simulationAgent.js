class SimulationAgent {
  async simulateWorkflow(workflow, scenarioCondition = null) {
    const nodes = workflow.nodes || [];
    const edges = workflow.edges || [];

    // Extract integration dependencies
    const dependenciesSet = new Set();
    nodes.forEach((n) => {
      if (['gmail', 'slack', 'discord', 'google-sheets'].includes(n.type)) {
        dependenciesSet.add(n.type);
      }
    });
    const dependencies = Array.from(dependenciesSet);

    // Analyze predicted failure points
    const predictedFailures = [];
    let riskScore = 15; // Base score

    if (dependencies.length > 2) riskScore += 20;
    if (nodes.length > 5) riskScore += 15;

    // Check specific node risks
    nodes.forEach((node) => {
      if (node.type === 'google-sheets') {
        const hasPrevAiNode = nodes.some((prev) => prev.type === 'ai-agent');
        if (hasPrevAiNode) {
          predictedFailures.push({
            nodeId: node.id,
            type: 'MISSING_FIELDS',
            severity: 'MEDIUM',
            probability: 0.27,
            reason: 'Destination Google Sheets node expects explicit column names, but previous AI Extraction node may output generic field keys.',
          });
          riskScore += 12;
        }
      }

      if (node.type === 'gmail' && !node.data?.recipient) {
        predictedFailures.push({
          nodeId: node.id,
          type: 'MISSING_FIELDS',
          severity: 'HIGH',
          probability: 0.65,
          reason: 'Gmail node missing explicit recipient email address configuration.',
        });
        riskScore += 18;
      }
    });

    // What-If Scenario Overrides
    if (scenarioCondition) {
      const condLower = scenarioCondition.toLowerCase();
      if (condLower.includes('gmail') || condLower.includes('api unavailable')) {
        const gmailNode = nodes.find((n) => n.type === 'gmail');
        predictedFailures.unshift({
          nodeId: gmailNode ? gmailNode.id : 'gmail_node',
          type: 'API_FAILURE',
          severity: 'CRITICAL',
          probability: 0.99,
          reason: `What-If Triggered: ${scenarioCondition}. External Gmail API endpoint unreachable.`,
        });
        riskScore = Math.min(100, riskScore + 45);
      } else if (condLower.includes('amount') || condLower.includes('missing')) {
        predictedFailures.unshift({
          nodeId: 'sheets_node',
          type: 'MISSING_FIELDS',
          severity: 'HIGH',
          probability: 0.85,
          reason: `What-If Triggered: ${scenarioCondition}. Required invoice_amount field was omitted from input payload.`,
        });
        riskScore = Math.min(100, riskScore + 35);
      }
    }

    riskScore = Math.min(100, Math.max(5, riskScore));

    let riskLevel = 'LOW';
    if (riskScore > 70) riskLevel = 'CRITICAL';
    else if (riskScore > 40) riskLevel = 'HIGH';
    else if (riskScore > 20) riskLevel = 'MODERATE';

    const recommendations = [];
    if (predictedFailures.some((f) => f.type === 'MISSING_FIELDS')) {
      recommendations.push('Add an explicit AI schema validation rule before downstream data nodes.');
    }
    if (dependencies.length >= 3) {
      recommendations.push('Ensure OAuth refresh tokens are active across Gmail, Slack, and Google Sheets.');
    }
    if (riskScore > 40) {
      recommendations.push('Configure Human Control Tower approval threshold for high-value node operations.');
    }

    const estimatedDurationMs = nodes.length * 1200 + 800;

    return {
      workflowId: workflow._id || workflow.id,
      workflowVersion: workflow.version || 1,
      mode: 'SIMULATION',
      riskScore,
      riskLevel,
      confidence: 0.92,
      estimatedDurationMs,
      predictedFailures,
      dependencies,
      recommendations,
      scenarios: scenarioCondition ? { scenario: scenarioCondition, outcome: 'SIMULATED_BRANCH' } : {},
    };
  }
}

module.exports = new SimulationAgent();
