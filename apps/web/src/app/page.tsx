import type { HealthCheckResponse } from "@joborg-ai/shared";

async function getHealthStatus(): Promise<HealthCheckResponse | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/health`, {
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const health = await getHealthStatus();

  return (
    <main>
      <h1>Joborg AI</h1>
      <p>
        AI layer for Joborg. This monorepo will grow into features like page
        analysis and change summarization.
      </p>

      <div className="status">
        <strong>API status:</strong>{" "}
        {health ? (
          <>
            connected — <code>{health.service}</code> ({health.status})
          </>
        ) : (
          <>offline — start the API with npm run dev:api</>
        )}
      </div>
    </main>
  );
}
