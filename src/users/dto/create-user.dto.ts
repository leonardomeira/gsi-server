import { Contains, IsEmail, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString({ message: "O nome de usuário deve ser uma string"})
    username: string;

    @IsString({ message: "O e-mail deve ser uma string"})
    @IsEmail()
    email: string;

    @IsString({ message: "A senha deve ser uma string"})
    @MinLength(12)
    password: string;

    @IsString({ message: "O primeiro nome deve ser uma string"})
    first_name: string;

    @IsString({ message: "Os sobrenomes devem ser uma string"})
    last_name: string;

    @IsString({ message: "O papel do usuário deve ser uma string"})
    role: string;

    created_at?: Date;

    updated_at?: Date;

    is_deleted: string;
}
