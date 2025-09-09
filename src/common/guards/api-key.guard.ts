
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../../auth/entities/api-key.entity';
import { Tenant } from '../../auth/entities/tenent.entity'; 

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @InjectRepository(ApiKey) private keys: Repository<ApiKey>,
    @InjectRepository(Tenant) private tenants: Repository<Tenant>,
  ) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const apiKey = (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '');
    const tenantName = req.requestedTenantName;
    if (!apiKey || !tenantName) throw new UnauthorizedException('Missing API key or X-Tenant-ID');

    const key = await this.keys.findOne({ where: { key: apiKey, isActive: true } });
    if (!key || !key.tenant || !key.tenant.isActive || key.tenant.name !== tenantName) {
      throw new UnauthorizedException('Invalid API key or tenant');
    }
    req.tenant = key.tenant;
    return true;
  }
}
