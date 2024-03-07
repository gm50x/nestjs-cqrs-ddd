import { ContextifyService } from '@gedai/contextify';
import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  WinstonModule,
  WinstonModuleOptions,
  utilities as nestWinstonUtils,
} from 'nest-winston';
import { config, format, transports } from 'winston';
import { SimpleAnonymizer } from './anonymizer.config';

let contextService: ContextifyService;

const { Console } = transports;
const { combine, timestamp, json } = format;
const { nestLike } = nestWinstonUtils.format;

const levels = {
  default: 'DEFAULT',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  verbose: 'VERBOSE',
} as const;

const severity = format((info) => {
  const { level } = info;
  return { ...info, severity: levels[level] };
});

const trace = format((info) => {
  const errorContext: Map<string, any> = info.error?.context;
  const traceId = errorContext?.get('traceId') ?? contextService.get('traceId');
  errorContext?.clear();
  return { ...info, traceId };
});

const sensitive = format((info) => {
  const anonymized = SimpleAnonymizer.maskFields(info, [
    'authorization',
    'password',
    /access.*token/i,
    /client.*secret/i,
    /.*api.*key/i,
  ]);
  return anonymized;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const treatError = format(({ stack: _stack, ...info }) => {
  if (!info.error) {
    return info;
  }

  const { error } = info;
  const res = error.response;

  const response = res
    ? { response: { status: res.status, data: res.data } }
    : {};

  return {
    ...info,
    error: { message: error.message, stack: error.stack, ...response },
  };
});

const remoteFormat = () =>
  combine(timestamp(), severity(), trace(), treatError(), sensitive(), json());

const localFormat = (appName: string) =>
  combine(
    timestamp(),
    severity(),
    trace(),
    treatError(),
    sensitive(),
    nestLike(appName),
  );

export const configureLogger = (app: INestApplication, silent = false) => {
  const configService = app.get(ConfigService);
  contextService = app.get(ContextifyService);

  const [env, appName, logLevel] = [
    configService.get('NODE_ENV', 'production'),
    configService.get('APP_NAME', 'dummy-world-service'),
    configService.get('LOG_LEVEL', 'info'),
  ];

  const useLocalFormat = ['development', 'testing'].includes(env);

  const loggerConfig: WinstonModuleOptions = {
    silent,
    levels: config.npm.levels,
    level: logLevel,
    format: useLocalFormat ? localFormat(appName) : remoteFormat(),
    transports: [new Console()],
  };

  const logger = WinstonModule.createLogger(loggerConfig);
  app.useLogger(logger);

  Logger.log('Logger initialized', 'Configuration');
  return app;
};
