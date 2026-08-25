// Server-Entry-Point — siehe docs/specs/spec-backend.md, Abschnitt 9

import { createApp } from './app.js';
import { bootstrap } from './bootstrap.js';

const PORT = process.env.PORT ?? 3000;

bootstrap()
  .then((dashboardService) => {
    const app = createApp(dashboardService);
    app.listen(PORT, () => {
      console.log(`Dashboard-Backend läuft auf Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Bootstrap fehlgeschlagen, Server wird nicht gestartet:', error);
    process.exit(1);
  });
