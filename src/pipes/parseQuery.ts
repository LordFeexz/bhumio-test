import { type PipeTransform, Injectable } from '@nestjs/common';

export interface PaginationQueryProps {
  page: number;
  limit: number;
}

@Injectable()
export class PaginationQuery implements PipeTransform<PaginationQueryProps> {
  transform({ page, limit }: PaginationQueryProps): PaginationQueryProps {
    return {
      page: parseInt(String(page)) || 1,
      limit: parseInt(String(limit)) || 10,
    };
  }
}
