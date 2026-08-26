import { randomUUID } from 'crypto';
import { getDriver } from '../connectors/neo4j/driver.js';

interface Resource {
	type?: string;
	label?: string;
	pages?: string;
	pageStart?: number;
	pageEnd?: number;
	wholeDocument?: boolean;
	url?: string;
	description?: string;
	_key?: string;
	[key: string]: unknown;
}

interface Resolver {
	resources?: Resource[];
	[key: string]: unknown;
}

function stripPageAnchor(url: string | undefined): string | undefined {
	if (!url) return url;
	return url.split('#')[0];
}

function parseSimpleRange(token: string): { pageStart: number; pageEnd: number } | null {
	const range = token.trim().match(/^(\d+)\s*[-–]\s*(\d+)$/);
	if (range) return { pageStart: Number(range[1]), pageEnd: Number(range[2]) };
	const single = token.trim().match(/^(\d+)$/);
	if (single) return { pageStart: Number(single[1]), pageEnd: Number(single[1]) };
	return null;
}

// Most `pages` strings are a single "N-M" (or "N–M") range and migrate 1:1. A couple of
// edge cases don't fit that shape:
//  - "all" -> the existing `wholeDocument` escape hatch, no page numbers at all.
//  - a comma-separated list of scattered pages/ranges (one known live resource) -> split
//    into one resource per page/range, since a single pageStart/pageEnd pair can't
//    represent it.
function migrateResource(res: Resource): Resource[] {
	if (!res || res.type !== 'pdf' || !('pages' in res)) return [res];

	const pages = String(res.pages ?? '').trim();
	const { pages: _pages, ...rest } = res;
	void _pages;

	if (pages === 'all') {
		return [{ ...rest, wholeDocument: true }];
	}

	if (pages.includes(',')) {
		const tokens = pages.split(',').map((t) => t.trim());
		return tokens.map((token) => {
			const range = parseSimpleRange(token);
			const pageLabel = range
				? range.pageStart === range.pageEnd
					? `p. ${range.pageStart}`
					: `p. ${range.pageStart}–${range.pageEnd}`
				: `p. ${token}`;
			return {
				...rest,
				_key: randomUUID(),
				label: `${rest.label} — ${pageLabel}`,
				url: stripPageAnchor(rest.url),
				...(range ? { pageStart: range.pageStart, pageEnd: range.pageEnd } : {})
			};
		});
	}

	const range = parseSimpleRange(pages);
	if (!range) {
		console.warn(
			`Unparseable pages "${pages}" on "${res.label}" (${res._key ?? 'no _key'}) — leaving pages field as-is, needs manual fix`
		);
		return [res];
	}
	return [
		{ ...rest, pageStart: range.pageStart, pageEnd: range.pageEnd, url: stripPageAnchor(rest.url) }
	];
}

async function migrate() {
	const driver = getDriver();
	const session = driver.session();
	let nodesUpdated = 0;
	let resourcesMigrated = 0;
	let resourcesSplit = 0;

	try {
		const result = await session.run(
			`MATCH (n:WizardNode) WHERE n.resolversJson CONTAINS '"pages"' RETURN n.id AS id, n.resolversJson AS json`
		);

		for (const record of result.records) {
			const id = record.get('id') as string;
			const resolvers = JSON.parse(record.get('json') as string) as Resolver[];
			let changed = false;

			for (const resolver of resolvers) {
				if (!resolver.resources) continue;
				const nextResources: Resource[] = [];
				for (const res of resolver.resources) {
					if (res && res.type === 'pdf' && 'pages' in res) {
						const migrated = migrateResource(res);
						if (migrated.length > 1) resourcesSplit++;
						resourcesMigrated += migrated.length;
						nextResources.push(...migrated);
						changed = true;
					} else {
						nextResources.push(res);
					}
				}
				resolver.resources = nextResources;
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

		console.log(
			`Done. ${nodesUpdated} nodes updated, ${resourcesMigrated} pdf resources migrated (${resourcesSplit} split into multiple entries).`
		);
	} finally {
		await session.close();
		await driver.close();
	}
}

migrate().catch((err) => {
	console.error('Migration failed:', err);
	process.exit(1);
});
