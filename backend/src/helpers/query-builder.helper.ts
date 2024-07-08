import { SelectQueryBuilder } from 'typeorm';

export class QueryBuilderHelper {
  static applyFilters(
    queryBuilder: SelectQueryBuilder<any>,
    query: any,
    type: 'default' | 'paginate' = 'default',
  ) {
    if (!query) {
      query = 'id';
    }

    Object.keys(query).forEach((key) => {
      const value = query[key];

      if (typeof value === 'object') {
        if (value['gte']) {
          queryBuilder.andWhere(`${key} >= :gte`, { gte: value['gte'] });
        }
        if (value['lte']) {
          queryBuilder.andWhere(`${key} <= :lte`, { lte: value['lte'] });
        }
        if (value['gt']) {
          queryBuilder.andWhere(`${key} > :gt`, { gt: value['gt'] });
        }
        if (value['lt']) {
          queryBuilder.andWhere(`${key} < :lt`, { lt: value['lt'] });
        }
        if (value['ne']) {
          queryBuilder.andWhere(`${key} <> :ne`, { ne: value['ne'] });
        }
      } else {
        if (type === 'paginate') {
          // do not query for sort, page, limit, and search
          if (!['sort', 'page', 'limit', 'search'].includes(key)) {
            queryBuilder.andWhere(`${key} = :${key}`, { [key]: value });
          }
        } else {
          // do not query for sort
          if (key !== 'sort') {
            queryBuilder.andWhere(`${key} = :${key}`, { [key]: value });
          }
        }
      }

      if (key === 'sort') {
        const sortFields = query.sort.split(',');
        sortFields.forEach((sortField: string) => {
          let order: 'ASC' | 'DESC' = 'ASC'; // Default order is ASC

          if (sortField.startsWith('-')) {
            order = 'DESC';
            sortField = sortField.substring(1);
          }

          if (order === 'ASC' || order === 'DESC') {
            const column = sortField;
            queryBuilder.addOrderBy(column, order);
          }
        });
      }
    });
  }
}
