import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();

    console.log('[MESSAGE-IN]', JSON.stringify(req));

    return next.handle().pipe(
      map((data) => {
        const devResponse: any = {
          ...data,
          duration: `${Date.now() - now}ms`,
        };

        if (data?.data?.items && Array.isArray(data?.data?.items)) {
          devResponse.data.items = data?.data?.items?.length;
        }

        console.log('[MESSAGE-OUT]', JSON.stringify(devResponse));

        return data;
      }),
    );
  }
}
