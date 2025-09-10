import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../../auth/entities/api-key.entity';
import { Tenant } from '../../auth/entities/tenent.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger= new Logger()
  constructor(
    @InjectRepository(ApiKey) private keys: Repository<ApiKey>,
    @InjectRepository(Tenant) private tenants: Repository<Tenant>,
    private config: ConfigService,
  ) { }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const apiKey = req.headers['x-api-key'];
    const tenantName = req.headers['x-tenant-id'];

    this.logger.debug(`apiKey ${apiKey}`)
    this.logger.debug(`Tenent Name ${tenantName}`)

    if (!apiKey || !tenantName) {
      throw new UnauthorizedException('Missing API key or X-Tenant-ID');
    }

    const defaultTenant = this.config.get<string>('DEFAULT_ADMIN_TENANT');
    const defaultKey = this.config.get<string>('DEFAULT_ADMIN_API_KEY');

    let tenant = await this.tenants.findOne({ where: { name: tenantName } });
    if (!tenant && tenantName === defaultTenant) {
      tenant = this.tenants.create({ name: defaultTenant, isActive: true });
      await this.tenants.save(tenant);
      const key = this.keys.create({ key: defaultKey, isActive: true, tenant });
      await this.keys.save(key);
    }

    const key = await this.keys.findOne({
      where: { key: apiKey, isActive: true },
      relations: ['tenant'],
    });

    if (!key || !key.tenant || !key.tenant.isActive || key.tenant.name !== tenantName) {
      throw new UnauthorizedException('Invalid API key or tenant');
    }

    req.tenant = key.tenant;
    req.requestedTenantName = tenantName;
    return true;
  }
}
