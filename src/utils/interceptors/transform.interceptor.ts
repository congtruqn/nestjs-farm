import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { MessageResponse } from 'src/domain/messages/message.response';

@Injectable()
export class TransformationInterceptor<T>
  implements NestInterceptor<T, MessageResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<MessageResponse<T>> {
    const now = Date.now();
    return next.handle().pipe(
      map((data) => ({
        data,
        message: data?.message ? data?.message : null,
        duration: `${Date.now() - now}ms`,
      })),
    );
  }
}
