import 'dotenv/config';

import { buildApp } from './app.js';
import { env } from './config/env.js';

const app = buildApp();

app.listen(env.PORT, () => {
  // Intentionally simple startup log for MVP scaffold.
  console.log(`@crown/api listening on port ${env.PORT}`);
});
