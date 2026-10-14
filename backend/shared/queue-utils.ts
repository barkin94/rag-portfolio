import logger from './logger';

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function recordFinalSyncStatus(
  finalStatus: 'success' | 'failed',
  msg: string,
  recordStatus: (status: 'success' | 'failed', details: string) => Promise<void>,
  notify: (success: boolean, details: string) => Promise<void>
): Promise<void> {
  try {
    await recordStatus(finalStatus, msg);
    await notify(finalStatus === 'success', msg);
    logger.info({ finalStatus, msg }, 'CV sync completed');
  } catch (statusError) {
    logger.error({ statusError, finalStatus, msg }, 'CRITICAL: Failed to record final sync status');
  }
}

export async function withPendingStatus<T>(
  recordPending: (details: string) => Promise<void>,
  recordFailed: (details: string) => Promise<void>,
  action: () => Promise<T>,
  errorPrefix: string
): Promise<{ success: true; data: T } | { success: false; message: string }> {
  await recordPending('Sync queued');

  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    const message = `${errorPrefix}: ${getErrorMessage(error)}`;
    await recordFailed(message);
    logger.error({ error }, errorPrefix);
    return { success: false, message };
  }
}