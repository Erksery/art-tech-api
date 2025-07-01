import { SetMetadata } from '@nestjs/common'

export const Status = (...statuses: string[]) => SetMetadata('status', statuses)
