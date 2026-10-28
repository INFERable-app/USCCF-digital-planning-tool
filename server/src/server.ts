import app from './app.js';
import { config } from './config.js';
import { migrateIdentities } from './startup/migrateIdentities.js';

migrateIdentities()
  .then(() => {
    app.listen(config.PORT, () => {
      console.log(`Backend listening on http://localhost:${config.PORT}`);
    });
  })
  .catch((err) => {
    console.error('Identity migration failed, exiting:', err);
    process.exit(1);
  });
