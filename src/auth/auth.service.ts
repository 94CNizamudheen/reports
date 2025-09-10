import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly repo: AuthRepository) {}

  async ensureDefault() {
    const name = process.env.DEFAULT_ADMIN_TENANT || 'demo';
    const keyVal = process.env.DEFAULT_ADMIN_API_KEY || 'demo-key';

    let tenant = await this.repo.findTenantByName(name);
    if (!tenant) {
      tenant = await this.repo.createTenant(name);
    }

    let key = await this.repo.findApiKey(keyVal);
    if (!key) {
      await this.repo.createApiKey(keyVal, tenant);
    }

    return { tenant: name, apiKey: keyVal };
  }
}
