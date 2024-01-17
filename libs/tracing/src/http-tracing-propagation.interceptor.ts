import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { TracingService } from './tracing.service';

@Injectable()
export class AxiosHttpTracingInterceptor implements OnModuleInit {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly tracing: TracingService,
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

  private applyTraceId(config: InternalAxiosRequestConfig) {
    config.headers['x-trace-id'] = this.tracing.get('traceId');
  }

  private getRequestToLog(config: InternalAxiosRequestConfig) {
    const data =
      config.data instanceof URLSearchParams
        ? Array.from(config.data).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          })
        : config.data;
    return {
      method: config.method,
      url: config.url,
      headers: config.headers,
      params: config.params,
      data,
    };
  }

  private getResponseToLog(response: AxiosResponse<any, any>) {
    return {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  }

  onModuleInit() {
    const logOutboundRequests =
      this.config.get('LOG_OUTBOUND_REQUESTS', 'true') === 'true';
    let requestLog: any;
    this.http.axiosRef.interceptors.request.use((request) => {
      this.applyTraceId(request);
      requestLog = this.getRequestToLog(request);
      return request;
    });
    this.http.axiosRef.interceptors.response.use(
      (response) => {
        const responseLog = this.getResponseToLog(response);
        if (logOutboundRequests) {
          this.logger.log({
            message: 'Success HTTP Request',
            request: requestLog,
            response: responseLog,
          });
        }
        return response;
      },
      (error) => {
        const responseLog = this.getResponseToLog(error.response);
        const errorLog = { message: error.message, stack: error.stack };
        if (logOutboundRequests) {
          this.logger.error({
            message: 'Failed HTTP Request',
            response: responseLog,
            error: errorLog,
          });
        }
        return Promise.reject(error);
      },
    );
  }
}
