import { Injectable, type PipeTransform } from '@nestjs/common';
import { GroupService } from '../app/group/group.service';

@Injectable()
export class ParseToGroup implements PipeTransform {
  constructor(private readonly groupService: GroupService) {}

  public async transform(value: any) {
    return await this.groupService.getById(value);
  }
}
