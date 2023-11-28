import { TracingService } from '@gedai/tracing';
import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  WinstonModule,
  WinstonModuleOptions,
  utilities as nestWinstonUtils,
} from 'nest-winston';
import { config, format, transports } from 'winston';

export class PropertiesAnonymizer {
  static instance = new PropertiesAnonymizer();
  private constructor() {}

  anonymizeDataStructure(data: object, properties: string[]) {
    const clone = this.ensureArray(this.cloneDataStructure(data));
    clone.forEach((obj) =>
      properties.forEach((property) => this.anonymizeProperty(obj, property)),
    );

    return clone;
  }

  private ensureArray<T = unknown>(data: T): T[] {
    return Array.isArray(data) ? data : [data];
  }

  private cloneDataStructure<T = unknown>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }

  private mutatePropertyValue(key: string) {
    return (target: unknown) => {
      const value = target[key];

      if (value === undefined) {
        return;
      }

      const isArray = Array.isArray(value);
      const valueType = typeof value;
      const isObject = valueType === 'object';

      const mask = '*****';
      if (isArray) {
        target[key] = Array[`${mask}`];
      } else if (isObject) {
        target[key] = `Object{${mask}}`;
      } else {
        target[key] = `${valueType}(${mask})`;
      }
    };
  }

  private anonymizeProperty(
    targetObject: unknown,
    dotNotationProperty: string,
  ) {
    const keys = dotNotationProperty.split('.');
    let currentObject = targetObject;

    const keysLength = keys.slice(0, -1).length;
    for (let i = 0; i < keysLength; i++) {
      const key = keys[i];
      currentObject = currentObject[key];

      if (Array.isArray(currentObject)) {
        const remainingKeys = keys.slice(i + 1).join('.');
        currentObject.forEach((x) => this.anonymizeProperty(x, remainingKeys));
        return;
      }

      const ignoreInvalidPropertyPath =
        typeof currentObject !== 'object' || currentObject === null;

      if (ignoreInvalidPropertyPath) {
        return;
      }
    }

    const key = keys.at(-1);
    const target = this.ensureArray(currentObject);
    target.forEach(this.mutatePropertyValue(key));
  }
}

let tracingService: TracingService;

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
  return { ...info, traceId: tracingService.get('traceId') };
});

const sensitive = format((info) => {
  const [anonymized] = PropertiesAnonymizer.instance.anonymizeDataStructure(
    info,
    [
      'request.body.password',
      'request.body.client_secret',
      'request.headers.authorization',
      'request.headers.x-api-key',
    ],
  );
  return { ...info, ...anonymized };
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

export const configureLogger = (app: INestApplication) => {
  const configService = app.get(ConfigService);
  tracingService = app.get(TracingService);

  const [env, appName, logLevel] = [
    configService.get('NODE_ENV', 'production'),
    configService.get('APP_NAME', 'dummy-world-service'),
    configService.get('LOG_LEVEL', 'info'),
  ];

  const useLocalFormat = env === 'development';

  const loggerConfig: WinstonModuleOptions = {
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
