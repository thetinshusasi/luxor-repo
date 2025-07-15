import { Collection } from '../../collection/entities/collection.entity';
import { CollectionDto } from '../../collection/dto/collection.dto';

export function convertCollectionEnitityToCollectionDto(
  collection: Collection,
  currentUserId: string
): CollectionDto {
  const isOwner = collection.userId === currentUserId;
  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    stock: collection.stock,
    price: collection.price,
    isOwner,
  };
}
