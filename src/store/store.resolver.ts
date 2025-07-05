import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { StoreService } from './services/store.service';
import { CreateStoreInput } from './dto/create-store.input';
import { UpdateStoreInput } from './dto/update-store.input';
import { StoreResponseDto } from './dto/store.dto';

@Resolver(() => StoreResponseDto)
export class StoreResolver {
  constructor(private readonly storeService: StoreService) {}

  @Mutation(() => StoreResponseDto)
  async  createStore(
      @Args('ownerId', { type: () => ID }) ownerId: string,
      @Args('data') data: CreateStoreInput,
  ) {
    return this.storeService.create(ownerId, data);
  }

  @Query(() => [StoreResponseDto])
  async stores() {
    return this.storeService.findAll();
  }

  @Query(() => StoreResponseDto)
  async store(@Args('id', { type: () => ID }) id: string) {
    return this.storeService.findOne(id);
  }

  @Mutation(() => StoreResponseDto)
  async updateStore(
      @Args('id', { type: () => ID }) id: string,
      @Args('data') data: UpdateStoreInput,
  ) {
    return this.storeService.update(id, data);
  }

  @Mutation(() => StoreResponseDto)
  async deleteStore(@Args('id', { type: () => ID }) id: string) {
    return this.storeService.remove(id);
  }

  @Query(() => [StoreResponseDto])
  async storesByOwner(@Args('ownerId', { type: () => ID }) ownerId: string) {
    return this.storeService.findByOwnerId(ownerId);
  }

  @Query(() => StoreResponseDto)
  async storeWithDetails(@Args('id', { type: () => ID }) id: string) {
    return this.storeService.findWithDetails(id);
  }

  @Mutation(() => StoreResponseDto)
  async publishStore(@Args('id', { type: () => ID }) id: string) {
    return this.storeService.publish(id);
  }

  @Mutation(() => StoreResponseDto)
  async approveStore(@Args('id', { type: () => ID }) id: string) {
    return this.storeService.approve(id);
  }

  @Mutation(() => StoreResponseDto)
  async rejectStore(@Args('id', { type: () => ID }) id: string) {
    return this.storeService.reject(id);
  }

  @Mutation(() => StoreResponseDto)
  async archiveStore(@Args('id', { type: () => ID }) id: string) {
    return this.storeService.archive(id);
  }
}
