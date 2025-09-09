
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const tenantHeader = (req.headers['x-tenant-id'] || '').toString();
    req.requestedTenantName = tenantHeader || null; 
    return next.handle();
  }
}
