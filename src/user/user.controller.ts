import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  CheckAbilities,
  ReadUserAbility,
} from 'src/ability/abilities.decorator';
import { Action } from 'src/ability/ability.factory';
import { AbilitesGuard } from 'src/ability/abilities.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: User })
  create(@Body() createUserDto: CreateUserDto) {
    // user不能使用下面的方法创建
    // const user: User = {
    //   id: 1,
    //   isAdmin: true,
    //   orgId: 1,
    // };

    const user: User = new User({
      id: 1,
      isAdmin: true,
      orgId: 1,
    });

    try {
      return this.userService.create(createUserDto, user);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  @Get()
  @CheckAbilities(new ReadUserAbility())
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @CheckAbilities(new ReadUserAbility())
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user: User = new User({ id: 1, isAdmin: true, orgId: 1 });

    try {
      return this.userService.update(+id, updateUserDto, user);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: User })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
