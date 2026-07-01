import dotenv from "dotenv";

dotenv.config();

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 5001),
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientUrl: requireEnv("CLIENT_URL", "http://localhost:3000"),
  databaseUrl: process.env.DATABASE_URL,
  geminiApiKey: process.env.GEMINI_API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  isProduction: (process.env.NODE_ENV ?? "development") === "production",
};
