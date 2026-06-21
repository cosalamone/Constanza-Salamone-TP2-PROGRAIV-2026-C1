import { IsString, IsDateString, IsOptional, MinLength, Matches, IsIn } from 'class-validator';
import { UserType } from '../../enums/userType.enum';

export class CreateUserDto {
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
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe tener al menos una mayúscula y un número.',
  })
  password!: string;

  @IsDateString()
  birthDate!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsIn([UserType.USER, UserType.ADMIN])
  role?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;
}
