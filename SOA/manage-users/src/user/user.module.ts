import {HttpModule, Module} from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  imports: [HttpModule],
  providers: [UserService]
})
export class UserModule {}
