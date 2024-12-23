import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../interfaces/token-payload.interface";
import { UserService } from "src/user/user.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
          jwtFromRequest: ExtractJwt.fromExtractors([
            (request: Request) => request.cookies?.Authentication,
          ]),
          secretOrKey: process.env.JWT_AT_SECRET
        });
    }

    validate(payload: TokenPayload) {
        return this.userService.findOneById(payload.userId);
    }
}