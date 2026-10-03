// Server entry point — see docs/specs/spec-backend.md, section 9

import { createApp } from './app.js';
import { openDatabase } from './core/database/database.js';
import { loadEventData } from './core/event-data/load-event-data.js';

const PORT = process.env.PORT ?? 3000;
const DATABASE_DIR = process.env.DATABASE_DIR ?? 'data';

Promise.all([openDatabase({ dataDir: DATABASE_DIR }), loadEventData()])
  .then(([db, eventData]) => {
    const app = createApp(eventData);
    const server = app.listen(PORT, () => {
      console.log(`Dashboard backend listening on port ${PORT}`);
    });

    // PGlite writes to disk in-process: close it cleanly so the data folder is not left half-written.
    const shutdown = () => {
      server.close();
      db.destroy().finally(() => process.exit(0));
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  })
  .catch((error) => {
    console.error('Opening the database or loading event data failed, server will not start:', error);
    process.exit(1);
  });
