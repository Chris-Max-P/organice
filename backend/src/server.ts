// Server entry point — see docs/specs/spec-backend.md, section 9

import { createApp } from './app.js';
import { loadEventData } from './core/event-data/load-event-data.js';

const PORT = process.env.PORT ?? 3000;

loadEventData()
  .then((eventData) => {
    const app = createApp(eventData);
    app.listen(PORT, () => {
      console.log(`Dashboard backend listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Loading event data failed, server will not start:', error);
    process.exit(1);
  });
