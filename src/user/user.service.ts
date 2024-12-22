import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  
  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    const newUserFromReq = createUserDto;

    try {

      const hashedPassword = await bcrypt.hash(newUserFromReq.password, 10);

      const newUser = await this.prismaService.user.create(
        {
          data: {
            ...newUserFromReq,
            password: hashedPassword
          }
        }
      );
      return newUser;
    } catch (error) {
      throw new HttpException(
        `Internal Server Error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(): Promise<UserModel[]> {
    try {
      return await this.prismaService.user.findMany();
    } catch (error) {
      throw new HttpException(
        `Internal Server Error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOneById(id: number): Promise<UserModel | String> {
    try {

      const requestedUser = await this.prismaService.user.findUnique({
        where: {id}
      });

      if (!requestedUser) {
        return "Usuário não encontrado."
      }

      return requestedUser;
    } catch (error) {
      throw new HttpException(
        `Internal Server Error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    };
  }

  async findOneByUsername(username: string): Promise<UserModel | String> {
    try {

      const requestedUser = await this.prismaService.user.findUnique({
        where: {username}
      });

      if (!requestedUser) {
        return "Usuário não encontrado."
      }

      return requestedUser;
    } catch (error) {
      throw new HttpException(
        `Internal Server Error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number): Promise<string> {
    try {
      await this.prismaService.user.delete({
        where: {id}
      });

      return "Usuário removido com sucesso!";
    } catch (error) {
      throw new HttpException(`
        Internal Server Error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
