import { driver, auth, type Driver } from 'neo4j-driver';
import { config } from '../../config.js';

let _driver: Driver | null = null;

export function getDriver(): Driver {
  if (!_driver) {
    _driver = driver(config.NEO4J_URI, auth.basic(config.NEO4J_USER, config.NEO4J_PASSWORD));
  }
  return _driver;
}
