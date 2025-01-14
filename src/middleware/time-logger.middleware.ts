import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TimeLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('ResponseTimeLogger');
  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url } = req;
    const reqTime = new Date().getTime();
    console.info('\n');
    this.logger.log(
      `🔵 REQUEST - 🔘Method:${method} 🔘Url:${url} 🔘AtTime: ${new Date().toLocaleString()}`,
    );

    res.on('finish', () => {
      const { statusCode, statusMessage } = res;
      const resTime = new Date().getTime() - reqTime;
      const responseTime = resTime / 1000;

      if (statusCode === 201 || statusCode === 200) {
        this.logger.log(
          `🟢 RESPONSE - 🔘Method:${method} 🔘Url:${url} 🔘StatusCode:${statusCode} 🔘ResponseIn: ${responseTime} sec`,
        );
      } else {
        this.logger.error(
          `🔴 RESPONSE - 🔘Method:${method} 🔘Url:${url} 🔘StatusCode:${statusCode} 🔘StatusMessage:${statusMessage} 🔘ResponseIn: ${responseTime} sec`,
        );
      }
    });

    next();
  }
}
