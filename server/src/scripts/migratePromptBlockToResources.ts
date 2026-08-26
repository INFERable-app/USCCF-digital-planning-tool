import { randomUUID } from 'crypto';
import { getDriver } from '../connectors/neo4j/driver.js';

interface Resource {
	type?: string;
	label?: string;
	text?: string;
	_key?: string;
	[key: string]: unknown;
}

interface PromptBlock {
	label?: string;
	text?: string;
}

interface Resolver {
	resources?: Resource[];
	promptBlock?: PromptBlock;
	[key: string]: unknown;
}

async function migrate() {
	const driver = getDriver();
	const session = driver.session();
	let nodesUpdated = 0;
	let promptsMigrated = 0;

	try {
		const result = await session.run(
			`MATCH (n:WizardNode) WHERE n.resolversJson CONTAINS '"promptBlock"' RETURN n.id AS id, n.resolversJson AS json`
		);

		for (const record of result.records) {
			const id = record.get('id') as string;
			const resolvers = JSON.parse(record.get('json') as string) as Resolver[];
			let changed = false;

			for (const resolver of resolvers) {
				if (!resolver.promptBlock) continue;
				const { promptBlock, ...rest } = resolver;
				const promptResource: Resource = {
					_key: randomUUID(),
					type: 'prompt',
					label: promptBlock.label || '',
					text: promptBlock.text || ''
				};
				rest.resources = [promptResource, ...(rest.resources || [])];
				Object.assign(resolver, rest);
				delete resolver.promptBlock;
				promptsMigrated++;
				changed = true;
			}

			if (changed) {
				await session.run('MATCH (n:WizardNode {id: $id}) SET n.resolversJson = $json', {
					id,
					json: JSON.stringify(resolvers)
				});
				nodesUpdated++;
				console.log(`Migrated ${id}`);
			}
		}

		console.log(`Done. ${nodesUpdated} nodes updated, ${promptsMigrated} prompt blocks migrated.`);
	} finally {
		await session.close();
		await driver.close();
	}
}

migrate().catch((err) => {
	console.error('Migration failed:', err);
	process.exit(1);
});
