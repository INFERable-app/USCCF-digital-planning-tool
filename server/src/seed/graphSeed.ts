import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getDriver } from '../connectors/neo4j/driver.js';
import { nodeToProps, edgeToRelProps } from '../connectors/graph/graphUtils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(resolve(__dirname, '../../../docs/wizardGraph.json'), 'utf8');
const graphData = JSON.parse(raw) as {
  nodes: Record<string, Record<string, unknown>>;
  edges: Record<string, Record<string, unknown>>;
};


async function seed() {
  const driver = getDriver();
  const session = driver.session();

  try {
    await session.run(
      'CREATE CONSTRAINT IF NOT EXISTS FOR (n:WizardNode) REQUIRE n.id IS UNIQUE'
    );

    for (const node of Object.values(graphData.nodes)) {
      await session.run('MERGE (n:WizardNode {id: $id}) SET n = $props', {
        id: node.id,
        props: nodeToProps(node),
      });
    }

    // Delete all existing OPTION relationships so re-runs start clean
    await session.run('MATCH ()-[r:OPTION]->() DELETE r');

    for (const node of Object.values(graphData.nodes)) {
      const edgeIds = node.edgeIds as string[];
      for (let i = 0; i < edgeIds.length; i++) {
        const edge = graphData.edges[edgeIds[i]];
        await session.run(
          `MATCH (src:WizardNode {id: $srcId}), (tgt:WizardNode {id: $tgtId})
           CREATE (src)-[r:OPTION]->(tgt)
           SET r = $props`,
          {
            srcId: node.id,
            tgtId: edge.targetNodeId,
            props: edgeToRelProps(edge, i),
          }
        );
      }
    }

    const nodeCount = Object.keys(graphData.nodes).length;
    const edgeCount = Object.keys(graphData.edges).length;
    console.log(`Seeded ${nodeCount} nodes and ${edgeCount} edges.`);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
