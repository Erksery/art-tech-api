import { Module } from '@nestjs/common';
import { AdminsService } from './services/admins.service';
import { AdminsController } from './controllers/admins.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), AuthModule],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
