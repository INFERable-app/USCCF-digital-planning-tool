import { getDriver } from '../connectors/neo4j/driver.js';

const welcomeProps = {
  id: 'welcome',
  type: 'welcome',
  layout: 'hero',
  challengeBar: false,
  label: 'Welcome',
  heading: 'Welcome to the planning tool.',
  body: 'Placeholder intro text.',
  positionX: 0,
  positionY: 0
};

async function bootstrap() {
  const driver = getDriver();
  const session = driver.session();

  try {
    await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (n:WizardNode) REQUIRE n.id IS UNIQUE');

    await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (a:Admin) REQUIRE a.email IS UNIQUE');

    // Creates the start screen only if it is missing; never overwrites it
    const result = await session.run('MERGE (n:WizardNode {id: $id}) ON CREATE SET n = $props', {
      id: welcomeProps.id,
      props: welcomeProps
    });

    const created = result.summary.counters.updates().nodesCreated > 0;
    console.log(
      created
        ? 'Constraints ready. Created the welcome screen.'
        : 'Constraints ready. The welcome screen already existed and was left unchanged.'
    );
  } finally {
    await session.close();
    await driver.close();
  }
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
