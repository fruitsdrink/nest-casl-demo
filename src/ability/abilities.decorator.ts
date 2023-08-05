import { SetMetadata } from '@nestjs/common';
import { Action, Subjects } from './ability.factory';
import { User } from 'src/user/entities/user.entity';

export interface RequiredRule {
  action: Action;
  subject: Subjects;
}

export class ReadUserAbility implements RequiredRule {
  action: Action = Action.Read;
  subject: User;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);
