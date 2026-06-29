export type HealthCheckResponse = {
  status: "ok";
  service: string;
  timestamp: string;
};

export function createHealthCheckResponse(service: string): HealthCheckResponse {
  return {
    status: "ok",
    service,
    timestamp: new Date().toISOString(),
  };
}
