#!/usr/bin/env bash
# Dumps the Neo4j database to a timestamped file under $BACKUP_DIR and prunes
# dumps older than $RETENTION_DAYS. Briefly stops and restarts the usccf-neo4j
# container (Community edition only supports offline dumps). Meant to be run
# on a schedule via the paired neo4j-backup.service / neo4j-backup.timer units.
set -euo pipefail

NEO4J_CONTAINER="usccf-neo4j"
NEO4J_VOLUME="usccf-digital-planning-tool_neo4j_data"
NEO4J_IMAGE="neo4j:5"
BACKUP_DIR="/var/backups/usccf-neo4j"
RETENTION_DAYS=30

DUMP_DIR="$(mktemp -d)"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

cleanup() {
	rm -rf "$DUMP_DIR"
}
trap cleanup EXIT

echo "==> Stopping $NEO4J_CONTAINER"
docker stop "$NEO4J_CONTAINER"
chmod 777 "$DUMP_DIR"

echo "==> Dumping database"
docker run --rm \
	-v "$NEO4J_VOLUME:/data" \
	-v "$DUMP_DIR:/backups" \
	"$NEO4J_IMAGE" neo4j-admin database dump neo4j --to-path=/backups

echo "==> Starting $NEO4J_CONTAINER"
docker start "$NEO4J_CONTAINER"

echo "==> Saving dump to $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
mv "$DUMP_DIR/neo4j.dump" "$BACKUP_DIR/neo4j-$TIMESTAMP.dump"

echo "==> Waiting for gateway to come back up"
for i in $(seq 1 12); do
	if curl -sf "http://localhost:3001/healthz" >/dev/null 2>&1; then
		echo "==> Gateway healthy."
		break
	fi
	if [ "$i" -eq 12 ]; then
		echo "WARNING: gateway did not report healthy after restart; check it manually." >&2
	fi
	sleep 5
done

echo "==> Pruning dumps older than $RETENTION_DAYS days"
find "$BACKUP_DIR" -name 'neo4j-*.dump' -mtime "+$RETENTION_DAYS" -delete

echo "==> Backup complete: $BACKUP_DIR/neo4j-$TIMESTAMP.dump"
