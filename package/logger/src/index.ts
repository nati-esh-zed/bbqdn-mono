export function logInfo(message: string, tag?: string): void {
  console.log(
    `[INFO] [${tag || "App"}] ${new Date().toISOString()}: ${message}`,
  );
}

export function logError(message: string, tag?: string): void {
  console.error(
    `[ERROR] [${tag || "App"}] ${new Date().toISOString()}: ${message}`,
  );
}
