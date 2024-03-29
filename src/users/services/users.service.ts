import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import config from 'src/config';

import { ProductsService } from 'src/products/services/products.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  private counterId = 1;
  private users: User[] = [
    {
      id: 1,
      email: 'correo@mail.com',
      password: '12345',
      role: 'admin',
    },
  ];

  constructor(
    private productsService: ProductsService,
    // private configServices: ConfigService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  findAll() {
    // const apiKey = this.configServices.get<string>(config);
    // const databaseName = this.configServices.get('DATABASE_NAME');
    const apiKey = this.configService.apiKey;
    const databaseName = this.configService.database.name;
    console.log(apiKey);
    console.log(databaseName);
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    this.counterId = this.counterId + 1;
    const newUser = {
      id: this.counterId,
      ...data,
    };
    const hashPassword = await bcrypt.hashSync(newUser.password, 10);
    newUser.password = hashPassword;
    this.users.push(newUser);
    // TODO: excluir password esto se hace con el modelo en mongo
    // const model = await newModel.save();
    // const { password, ...user } = model.toJSON();
    // return user;
    return newUser;
  }

  // findByEmail(email: string) {
  //   return this.userModel.findOne({ email }).exec();
  // }

  findOneByEmail(email: string) {
    const user = this.users.find((item) => item.email === email);

    return user;
  }

  update(id: number, changes: UpdateUserDto) {
    const user = this.findOne(id);
    const index = this.users.findIndex((item) => item.id === id);
    this.users[index] = {
      ...user,
      ...changes,
    };
    return this.users[index];
  }

  remove(id: number) {
    const index = this.users.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`User #${id} not found`);
    }
    this.users.splice(index, 1);
    return true;
  }

  async getOrderByUSer(idUser: number) {
    const user = this.findOne(idUser);
    return {
      date: new Date(),
      user,
      products: await this.productsService.findAll(),
    };
  }
}
