import {
  CommonConfigModuleOptions,
  CommonConfigOptionsFactory,
} from '@gedai/nestjs-common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig implements CommonConfigOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createOptions(): CommonConfigModuleOptions {
    const appName = this.config.getOrThrow('APP_NAME');
    const environment = this.config.get('NODE_ENV', 'development');
    const logFormat = this.config.get('LOG_FORMAT', 'json');
    const logLevel = this.config.get('LOG_LEVEL', 'info');
    const logSilent = this.config.get('LOG_SILENT', 'false');
    const httpTrafficInspectionMode = this.config.getOrThrow(
      'TRAFFIC_INSPECTION_HTTP_MODE',
      'all',
    );

    return {
      appName,
      environment,
      httpTrafficInspection: {
        mode: httpTrafficInspectionMode,
        allowedOutboundRoutes: [],
        ignoredInboundRoutes: [],
      },
      logger: {
        format: logFormat,
        level: logLevel,
        silent: logSilent === 'true',
      },
    };
  }
}
