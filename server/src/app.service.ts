import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CacheService } from './shared/cache/cache.service';
@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly cacheService: CacheService) {}
  async onModuleInit() {
    await this.deleteGrantListCache();
    await this.deleteAllCategoriesCache();
  }

  async deleteGrantListCache() {
    await this.cacheService.delete('grants_list');
  }
  async deleteAllCategoriesCache() {
    await this.cacheService.delete('all_categories');
  }
}
