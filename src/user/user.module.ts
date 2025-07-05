import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { UserResolver } from './user.resolver';
// import { AuthModule } from '../auth/auth.module'; // for JwtAuthGuard

@Module({
  // imports: [
  //   forwardRef(() => AuthModule), // Handle circular dependency if AuthModule imports UserModule
  // ],
  providers: [UserService, UserRepository, UserResolver],
  exports: [UserService], // Export service if other modules need it
})
export class UserModule {}
