export async function checkAndConsumeCredit(): Promise<{ allowed: boolean; error?: string }> {
  // Always allow in the standalone simple builder
  return { allowed: true };
}
