import pino, { Logger } from 'pino';
import Config from './backend/config';

const isProduction = process.env.NODE_ENV === 'production';

const logger: Logger = pino({
  level: Config.LOG_LEVEL,
  // Transport is only enabled when NOT in production
  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

export default logger;

// Example usage
logger.info('Logger initialized');