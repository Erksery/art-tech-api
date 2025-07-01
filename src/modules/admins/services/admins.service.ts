import { Injectable } from '@nestjs/common'

import { User } from 'src/models/user.model'
import { InjectModel } from '@nestjs/sequelize'
import { confirmUserAccount } from './utils/confirmUserAccount'
import { StatusType } from 'src/config/constants.config'
import { FilterUsersDto } from '../dto/get-users.dto'
import { findAllUsers } from './utils/findAllUsers'

@Injectable()
export class AdminsService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async changeUserAccount(userId: string, status: StatusType) {
    return await confirmUserAccount(this.userModel, userId, status)
  }
  async findAllUsers(filters: FilterUsersDto) {
    return await findAllUsers(this.userModel, filters)
  }
}
