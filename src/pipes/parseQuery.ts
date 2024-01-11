import { type PipeTransform, Injectable } from '@nestjs/common';

export interface PaginationQueryProps {
  page: number;
  limit: number;
  sort: SortOpts;
}

export type SortOpts = 'DESC' | 'ASC';

@Injectable()
export class PaginationQuery implements PipeTransform<PaginationQueryProps> {
  transform({ page, limit, sort }: PaginationQueryProps): PaginationQueryProps {
    return {
      page: parseInt(String(page)) || 1,
      limit: parseInt(String(limit)) || 10,
      sort: ['DESC', 'ASC'].includes(sort.toUpperCase())
        ? (sort.toUpperCase() as SortOpts)
        : 'DESC',
    };
  }
}
