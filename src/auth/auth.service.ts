import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { User as UserModel } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async login(user: UserModel, response: Response) {
        const expiresAccessToken = new Date();
        expiresAccessToken.setMilliseconds(
            expiresAccessToken.getTime() + parseInt(process.env.JWT_AT_EXP_MS)
        );

        const tokenPayload: TokenPayload = {
            userId: user.id
        };

        const accessToken = this.jwtService.sign(
            tokenPayload,
            {
                secret: process.env.JWT_AT_SECRET,
                expiresIn: process.env.JWT_AT_EXP
            }
        );

        response.cookie('Authentication', accessToken), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: expiresAccessToken
        };
    }
    
    async verifyUser(username: string, password: string) {
        try {
            const user: UserModel = await this.userService.findOneByUsername(username);

            const authenticated = await bcrypt.compare(password, user.password);

            if (!authenticated) {
                throw new UnauthorizedException();
            }

            return user;

        } catch (error) {
            throw new UnauthorizedException('Usuário e/ou senha inválidos.');
        }
    }
}
