import { Injectable } from '@nestjs/common';

@Injectable()
export class MapperService {
  dtoToEntity<T, U>(dto: T, entityClass: new () => U): U {
    const entity = new entityClass();
    Object.assign(entity, dto);
    return entity;
  }

  entityToDto<T, U>(entity: T, dtoClass: new () => U): U {
    const dto = new dtoClass();
    Object.assign(dto, entity);
    return dto;
  }

  listEntitiesToListDtos<T, U>(entities: T[], dtoClass: new () => U): U[] {
    return entities.map((entity) => this.entityToDto(entity, dtoClass));
  }
}
