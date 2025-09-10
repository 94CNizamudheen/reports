import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenent.entity';
import { ApiKey } from './entities/api-key.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Tenant) private readonly tenants: Repository<Tenant>,
    @InjectRepository(ApiKey) private readonly keys: Repository<ApiKey>,
  ) {}

  async findTenantByName(name: string): Promise<Tenant | null> {
    return this.tenants.findOne({ where: { name } });
  }

  async createTenant(name: string): Promise<Tenant> {
    const tenant = this.tenants.create({ name });
    return this.tenants.save(tenant);
  }

  async findApiKey(key: string): Promise<ApiKey | null> {
    return this.keys.findOne({
      where: { key },
      relations: ['tenant'],
    });
  }

  async createApiKey(key: string, tenant: Tenant): Promise<ApiKey> {
    const apiKey = this.keys.create({ key, tenant });
    return this.keys.save(apiKey);
  }
}
