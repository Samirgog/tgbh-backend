import { Module } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { UserRepository } from '../user/repositories/user.repository';
import { UserResolver } from '../user/user.resolver';
import {AuthService} from "./services/auth.service";
import { AuthResolver } from './auth.resolver';

@Module({
    providers: [UserService, UserRepository, UserResolver, AuthResolver, AuthService],
    exports: [UserService],
})
export class AuthModule {}
