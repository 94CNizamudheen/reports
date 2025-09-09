import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenent.entity'; 
import { ApiKey } from './entities/api-key.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Tenant) private tenants: Repository<Tenant>,
    @InjectRepository(ApiKey) private keys: Repository<ApiKey>,
  ) {}

  async ensureDefault() {
    const name = process.env.DEFAULT_ADMIN_TENANT || 'demo';
    const keyVal = process.env.DEFAULT_ADMIN_API_KEY || 'demo-key';
    let tenant = await this.tenants.findOne({ where: { name }});
    if (!tenant) tenant = await this.tenants.save(this.tenants.create({ name }));
    let key = await this.keys.findOne({ where: { key: keyVal } });
    if (!key) await this.keys.save(this.keys.create({ key: keyVal, tenant }));
    return { tenant: name, apiKey: keyVal };
  }
}
