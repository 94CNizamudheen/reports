import { Injectable } from "@nestjs/common"
import type { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm"
import type { ConfigService } from "@nestjs/config"

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.configService.get("DB_HOST", "localhost"),
      port: this.configService.get("DB_PORT", 5432),
      username: this.configService.get("DB_USERNAME", "postgres"),
      password: this.configService.get("DB_PASSWORD", "password"),
      database: this.configService.get("DB_NAME", "pos_db"),
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      synchronize: this.configService.get("NODE_ENV") !== "production",
      logging: this.configService.get("NODE_ENV") === "development",
    }
  }
}
