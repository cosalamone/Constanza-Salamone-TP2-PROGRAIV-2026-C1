import { IsString, IsEmail, IsDateString } from 'class-validator';

// DTO para la creación de un usuario. Define las propiedades esperadas en el body.
export class CreateUserDto {
    @IsString()
    name!: string;

    @IsString()
    lastName!: string;

    @IsEmail()
    email!: string;

    @IsString()
    password!: string;

    // @IsDateString()
    // birthDate!: string;
}
