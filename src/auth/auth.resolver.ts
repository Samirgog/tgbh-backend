import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './services/auth.service';
import { UserEntity } from '../user/entities/user.entity';
import { Me } from '../common/decorators/me.decorator';
import { AuthInput } from './dto/auth.input';

@Resolver()
export class AuthResolver {
    constructor(private service: AuthService) {}
    @Mutation(() => UserEntity)
    async auth(@Args('input') input: AuthInput) {
        return this.service.auth({
            input,
        });
    }

    @Query(() => UserEntity)
    async me(@Me() user: UserEntity) {
        return user;
    }
}
