import { driver, auth } from 'neo4j-driver';
import type { GraphRepository, WizardGraph, GraphNode, GraphEdge } from './types.js';

export function createNeo4jRepository(uri: string, user: string, password: string): GraphRepository {
  // Driver created here; sessions and Cypher queries to be added once the
  // Neo4j schema is finalized (see docs/graph-data-spec.md).
  const _driver = driver(uri, auth.basic(user, password));

  return {
    async getWizardGraph(): Promise<WizardGraph> {
      void _driver;
      throw new Error('Neo4j repository not yet implemented — set GRAPH_BACKEND=stub');
    },
    async getNode(_id: string): Promise<GraphNode | null> {
      throw new Error('Neo4j repository not yet implemented — set GRAPH_BACKEND=stub');
    },
    async getEdge(_id: string): Promise<GraphEdge | null> {
      throw new Error('Neo4j repository not yet implemented — set GRAPH_BACKEND=stub');
    },
  };
}
