import { getDriver } from '../neo4j/driver.js';
import type { GraphRepository, WizardGraph, GraphNode, GraphEdge } from './types.js';
import { nodeToProps, edgeToRelProps } from './graphUtils.js';

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

    async replaceGraph(graph: WizardGraph): Promise<void> {
      const session = getDriver().session();
      try {
        await session.run('MATCH ()-[r:OPTION]->() DELETE r');
        await session.run('MATCH (n:WizardNode) DELETE n');

        for (const node of Object.values(graph.nodes)) {
          await session.run('MERGE (n:WizardNode {id: $id}) SET n = $props', {
            id: node.id,
            props: nodeToProps(node as unknown as Record<string, unknown>),
          });
        }

        for (const node of Object.values(graph.nodes)) {
          const edgeIds = node.edgeIds ?? [];
          for (let i = 0; i < edgeIds.length; i++) {
            const edge = graph.edges[edgeIds[i]];
            if (!edge) continue;
            await session.run(
              `MATCH (src:WizardNode {id: $srcId}), (tgt:WizardNode {id: $tgtId})
               CREATE (src)-[r:OPTION]->(tgt)
               SET r = $props`,
              {
                srcId: node.id,
                tgtId: edge.targetNodeId,
                props: edgeToRelProps(edge as unknown as Record<string, unknown>, i),
              }
            );
          }
        }
      } finally {
        await session.close();
      }
    },

    async createNode(node: GraphNode): Promise<void> {
      const session = getDriver().session();
      try {
        await session.run('CREATE (n:WizardNode) SET n = $props', {
          props: nodeToProps(node as unknown as Record<string, unknown>),
        });
      } finally {
        await session.close();
      }
    },

    // `edgeIds` is not a stored property — the wizard derives it from the
    // `order` prop on outgoing OPTION relationships, so a reorder is written by
    // rewriting those orders. Setting a property to null in Cypher removes it,
    // so a null field in the patch clears that field.
    async updateNode(id: string, fields: Partial<GraphNode>): Promise<void> {
      const session = getDriver().session();
      try {
        const { edgeIds, ...rest } = fields as Record<string, unknown>;
        const props = nodeToProps({ ...rest, id });
        await session.run('MATCH (n:WizardNode {id: $id}) SET n += $props', { id, props });

        if (Array.isArray(edgeIds)) {
          for (let i = 0; i < edgeIds.length; i++) {
            await session.run(
              'MATCH (:WizardNode {id: $id})-[r:OPTION {id: $edgeId}]->() SET r.order = $order',
              { id, edgeId: edgeIds[i], order: i }
            );
          }
        }
      } finally {
        await session.close();
      }
    },

    async deleteNode(id: string): Promise<void> {
      const session = getDriver().session();
      try {
        await session.run('MATCH (n:WizardNode {id: $id}) DETACH DELETE n', { id });
      } finally {
        await session.close();
      }
    },

    // New edges land at the end of the source node's existing order.
    async createEdge(sourceId: string, edge: GraphEdge): Promise<void> {
      const session = getDriver().session();
      try {
        const countResult = await session.run(
          'MATCH (:WizardNode {id: $sourceId})-[r:OPTION]->() RETURN count(r) AS n',
          { sourceId }
        );
        const order = countResult.records[0].get('n').toNumber();
        await session.run(
          `MATCH (src:WizardNode {id: $sourceId}), (tgt:WizardNode {id: $targetNodeId})
           CREATE (src)-[r:OPTION]->(tgt)
           SET r = $props`,
          {
            sourceId,
            targetNodeId: edge.targetNodeId,
            props: edgeToRelProps(edge as unknown as Record<string, unknown>, order),
          }
        );
      } finally {
        await session.close();
      }
    },

    // Neo4j cannot re-point a relationship in place, so a changed target is
    // written by recreating the relationship with its existing props and order.
    async updateEdge(id: string, fields: Partial<GraphEdge>): Promise<void> {
      const session = getDriver().session();
      try {
        const { targetNodeId, ...rest } = fields as Record<string, unknown>;

        const existing = await session.run(
          `MATCH (src:WizardNode)-[r:OPTION {id: $id}]->(tgt:WizardNode)
           RETURN r AS rel, src.id AS sourceId, tgt.id AS currentTarget`,
          { id }
        );
        if (existing.records.length === 0) throw new Error(`Unknown edge "${id}"`);
        const record = existing.records[0];

        if (typeof targetNodeId === 'string' && record.get('currentTarget') !== targetNodeId) {
          const relProps = record.get('rel').properties as Record<string, unknown>;
          const sourceId = record.get('sourceId') as string;
          await session.run('MATCH ()-[r:OPTION {id: $id}]->() DELETE r', { id });
          await session.run(
            `MATCH (src:WizardNode {id: $sourceId}), (tgt:WizardNode {id: $targetNodeId})
             CREATE (src)-[r:OPTION]->(tgt)
             SET r = $props`,
            { sourceId, targetNodeId, props: { ...relProps, ...rest } }
          );
          return;
        }

        if (Object.keys(rest).length > 0) {
          await session.run('MATCH ()-[r:OPTION {id: $id}]->() SET r += $props', {
            id,
            props: rest,
          });
        }
      } finally {
        await session.close();
      }
    },

    async deleteEdge(id: string): Promise<void> {
      const session = getDriver().session();
      try {
        await session.run('MATCH ()-[r:OPTION {id: $id}]->() DELETE r', { id });
      } finally {
        await session.close();
      }
    },
  };
}
