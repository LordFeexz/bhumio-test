import { Injectable, type PipeTransform } from '@nestjs/common';
import { AdminService } from '../app/admin/admin.service';

@Injectable()
export class ParseToAdmin implements PipeTransform {
  constructor(private readonly adminService: AdminService) {}

  public async transform(value: any) {
    return await this.adminService.getOneById(value);
  }
}
