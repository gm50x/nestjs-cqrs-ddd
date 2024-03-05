import { ContextifyService } from '@gedai/contextify';
import { INestApplication } from '@nestjs/common';
import * as http from 'http';
import * as https from 'https';

function mountInterceptor(
  app: INestApplication,
  module: typeof http | typeof https,
) {
  const context = app.get(ContextifyService);
  const withTraceId = (target: typeof module.get | typeof module.request) =>
    function (...args: any[]) {
      const traceId = context.get('traceId');
      const [{ headers }] = args;
      if (traceId) {
        headers['x-trace-id'] = traceId;
      }
      return target.apply(this, args);
    };
  const targets = [module.get, module.request];
  for (const target of targets) {
    module[target.name] = withTraceId(target);
  }
}

export function configureOutboundHttpTracing(app: INestApplication) {
  for (const module of [http, https]) {
    mountInterceptor(app, module);
  }
  return app;
}
