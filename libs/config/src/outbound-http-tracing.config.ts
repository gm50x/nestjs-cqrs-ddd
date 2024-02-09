import { AsyncContextService } from '@gedai/async-context';
import { INestApplication } from '@nestjs/common';
import * as http from 'http';
import * as https from 'https';

function mountInterceptor(
  app: INestApplication,
  module: typeof http | typeof https,
) {
  const context = app.get(AsyncContextService);
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
  const modules = new Map<string, typeof http | typeof https>()
    .set('http', http)
    .set('https', https);

  for (const module of modules.values()) {
    mountInterceptor(app, module);
  }
  return app;
}
