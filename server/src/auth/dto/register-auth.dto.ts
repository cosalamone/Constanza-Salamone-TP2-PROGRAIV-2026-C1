import { IsString, IsDateString, IsOptional, MinLength, Matches } from 'class-validator';

export class RegisterAuthDto {
    @IsString()
    @MinLength(2)
    name!: string;

    @IsString()
    @MinLength(2)
    lastName!: string;

    @IsString()
    @MinLength(3)
    username!: string;

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[A-Z])(?=.*\d)/, { message: 'La contraseña debe tener al menos una mayúscula y un número.' })
    password!: string;

    @IsDateString()
    birthDate!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    role?: string;

    @IsString()
    profileImage!: string;
}
