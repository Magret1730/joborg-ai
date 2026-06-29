import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`Joborg AI API running on http://localhost:${env.port}`);
  console.log(`Environment: ${env.nodeEnv}`);
});
