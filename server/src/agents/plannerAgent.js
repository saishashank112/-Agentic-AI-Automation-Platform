class PlannerAgent {
  async plan(workflow) {
    const nodes = workflow.nodes || [];
    const edges = workflow.edges || [];

    // Topological sort or simple ordering based on edges
    const nodeMap = new Map();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    const inDegree = new Map();
    nodes.forEach((n) => inDegree.set(n.id, 0));

    edges.forEach((e) => {
      if (inDegree.has(e.target)) {
        inDegree.set(e.target, inDegree.get(e.target) + 1);
      }
    });

    const queue = [];
    inDegree.forEach((degree, id) => {
      if (degree === 0) queue.push(id);
    });

    const executionPlan = [];
    while (queue.length > 0) {
      const currId = queue.shift();
      const node = nodeMap.get(currId);
      if (node) {
        executionPlan.push(node);
      }

      edges
        .filter((e) => e.source === currId)
        .forEach((e) => {
          const nextDegree = inDegree.get(e.target) - 1;
          inDegree.set(e.target, nextDegree);
          if (nextDegree === 0) queue.push(e.target);
        });
    }

    // Fallback if disconnected nodes exist
    if (executionPlan.length < nodes.length) {
      nodes.forEach((n) => {
        if (!executionPlan.some((p) => p.id === n.id)) {
          executionPlan.push(n);
        }
      });
    }

    const confidenceScore = executionPlan.length > 0 ? 0.95 : 0.5;

    return {
      executionPlan,
      confidenceScore,
      stepsCount: executionPlan.length,
      planSummary: `Planned ${executionPlan.length} execution steps across graph nodes.`,
    };
  }
}

module.exports = new PlannerAgent();
