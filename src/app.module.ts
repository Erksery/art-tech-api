import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ServeStaticModule } from '@nestjs/serve-static'

import { AuthModule } from './auth/auth.module'
import { FilesModule } from './modules/files/files.module'
import { UserModule } from './modules/users/user.module'
import { FoldersModule } from './modules/folders/folders.module'
import { AdminsModule } from './modules/admins/admins.module'

import { join } from 'path'
import { sequelizeConfig } from './config/sequlize.config'

@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads'
    }),
    FilesModule,
    UserModule,
    AuthModule,
    FoldersModule,
    AdminsModule
  ],
  exports: [SequelizeModule]
})
export class AppModule {}
