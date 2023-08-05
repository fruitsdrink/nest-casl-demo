import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from './ability.factory';
import { CHECK_ABILITY, RequiredRule } from './abilities.decorator';
import { User } from 'src/user/entities/user.entity';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class AbilitesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    // const user = context.switchToHttp().getRequest().user;
    const user = new User({ id: 1, isAdmin: false, orgId: 1 });

    const ability = this.abilityFactory.defineAbility(user);
    try {
      rules.forEach((rule) => {
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject);
      });
      return true;

      // return rules.every((rule) => ability.can(rule.action, rule.subject));
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
}
