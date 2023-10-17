import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';

const mapping = (body: Record<string, string | number>) => {
  const keys: string[] = ['email', 'phone'];
  const result: Record<string, string | number> = {};

  for (const key in body) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      const value = body[key];

      result[key] = value;

      if (keys.includes(key)) {
        result[key] = '******';
      }
    }
  }

  return result;
};

@Injectable()
export class AspectLogger implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();
    const { originalUrl, method, params, query, body, headers } = req;

    console.log('[MESSAGE-IN]', {
      originalUrl,
      headers: JSON.stringify(headers),
      method,
      params,
      query,
      body: JSON.stringify(mapping(body)),
    });

    return next.handle().pipe(
      tap((data) =>
        console.log('[MESSAGE-OUT]', {
          headers: JSON.stringify(headers),
          statusCode,
          data: data?.data?.items
            ? {
                results: data?.data?.items?.length,
                length: data?.data?.items?.length,
              }
            : mapping(data?.data),
        }),
      ),
    );
  }
}
