import { Injectable } from '@nestjs/common';
import { Config } from '@src/configs/config.interface';

@Injectable()
export class ConfigService {
  private config: Config;
  constructor() {
    this.config = {
      version: process.env.npm_package_version ?? '',
      commitHash: process.env.commit_hash ?? '',
      node_env: process.env.NODE_ENV ?? 'development',
      isDebug: process.env.DEBUG === 'TRUE',
    };
  }

  public get<K extends keyof Config>(key: K): Config[K];

  public get<K extends keyof Config>(
    key: K,
    defaultValue: Config[K],
  ): Config[K];

  public get<K extends keyof Config>(
    key: K,
    defaultValue?: Config[K],
  ): Config[K] | undefined {
    return this.config[key] ?? defaultValue;
  }
}
