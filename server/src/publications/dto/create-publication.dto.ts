import { IsOptional, IsString, MinLength } from "class-validator";

export class CreatePublicationDto {

    @IsString()
    @MinLength(1, { message: 'El contenido de la publicación no puede estar vacío' })
    title!: string;

    @IsString()
    @MinLength(1, { message: 'La descripción de la publicación no puede estar vacía' })
    description!: string;

    @IsString()
    @IsOptional()
    imageUrl!: string;

    @IsString()
    userId!: string;
}
