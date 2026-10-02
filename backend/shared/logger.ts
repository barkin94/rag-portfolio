import pino, { Logger } from 'pino';
import config from './config';

const isProduction = process.env.NODE_ENV === 'production';

const logger: Logger = pino({
  level: config.LOG_LEVEL,
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