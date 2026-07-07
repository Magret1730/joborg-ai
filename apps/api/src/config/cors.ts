import type { CorsOptions } from "cors";
import { env } from "../config/env.js";

const LOCAL_DEV_ORIGIN =
  /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3})(:\d+)?$/;

export function getCorsOptions(): CorsOptions {
  if (env.isProduction) {
    return { origin: env.clientUrl };
  }

  // In dev, allow localhost / LAN origins so port changes don't break CORS.
  return {
    origin(origin, callback) {
      if (
        !origin ||
        origin === env.clientUrl ||
        LOCAL_DEV_ORIGIN.test(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(null, env.clientUrl);
    },
  };
}
