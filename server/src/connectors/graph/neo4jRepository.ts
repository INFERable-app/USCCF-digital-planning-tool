import { getDriver } from '../neo4j/driver.js';
import type { GraphRepository, WizardGraph, GraphNode, GraphEdge } from './types.js';

function buildNode(props: Record<string, unknown>, edgeIds: string[]): GraphNode {
  const { resolversJson, ...rest } = props;
  const result: Record<string, unknown> = { ...rest, edgeIds };
  if (typeof resolversJson === 'string') {
    result.resolvers = JSON.parse(resolversJson);
  }
  return result as GraphNode;
}

function buildEdge(relProps: Record<string, unknown>, targetNodeId: string): GraphEdge {
  const { order, ...rest } = relProps;
  void order;
  return { ...rest, targetNodeId } as GraphEdge;
}

export function createNeo4jRepository(): GraphRepository {
  return {
    async getWizardGraph(): Promise<WizardGraph> {
      const session = getDriver().session();
      try {
        const nodeResult = await session.run(`
          MATCH (n:WizardNode)
          OPTIONAL MATCH (n)-[r:OPTION]->(t:WizardNode)
          WITH n, r, t ORDER BY r.order
          RETURN n, collect(r.id) AS edgeIds
        `);

        const edgeResult = await session.run(`
          MATCH (src:WizardNode)-[r:OPTION]->(tgt:WizardNode)
          RETURN r, tgt.id AS targetNodeId
        `);

        const nodes: Record<string, GraphNode> = {};
        for (const record of nodeResult.records) {
          const props = record.get('n').properties as Record<string, unknown>;
          const edgeIds = record.get('edgeIds') as string[];
          nodes[props.id as string] = buildNode(props, edgeIds);
        }

        const edges: Record<string, GraphEdge> = {};
        for (const record of edgeResult.records) {
          const relProps = record.get('r').properties as Record<string, unknown>;
          const targetNodeId = record.get('targetNodeId') as string;
          const edge = buildEdge(relProps, targetNodeId);
          edges[edge.id] = edge;
        }

        return { startNodeId: 'welcome', nodes, edges };
      } finally {
        await session.close();
      }
    },

    async getNode(id: string): Promise<GraphNode | null> {
      const session = getDriver().session();
      try {
        const result = await session.run(
          `MATCH (n:WizardNode {id: $id})
           OPTIONAL MATCH (n)-[r:OPTION]->(t:WizardNode)
           WITH n, r, t ORDER BY r.order
           RETURN n, collect(r.id) AS edgeIds`,
          { id }
        );
        if (result.records.length === 0) return null;
        const record = result.records[0];
        const props = record.get('n').properties as Record<string, unknown>;
        const edgeIds = record.get('edgeIds') as string[];
        return buildNode(props, edgeIds);
      } finally {
        await session.close();
      }
    },

    async getEdge(id: string): Promise<GraphEdge | null> {
      const session = getDriver().session();
      try {
        const result = await session.run(
          `MATCH ()-[r:OPTION {id: $id}]->(tgt:WizardNode)
           RETURN r, tgt.id AS targetNodeId`,
          { id }
        );
        if (result.records.length === 0) return null;
        const record = result.records[0];
        const relProps = record.get('r').properties as Record<string, unknown>;
        const targetNodeId = record.get('targetNodeId') as string;
        return buildEdge(relProps, targetNodeId);
      } finally {
        await session.close();
      }
    },
  };
}