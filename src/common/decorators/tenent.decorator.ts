
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const TenantId = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.tenant?.id ?? null;
});
