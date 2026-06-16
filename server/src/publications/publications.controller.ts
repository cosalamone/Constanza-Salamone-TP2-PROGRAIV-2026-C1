import { Controller,  Post, Body,} from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  create(@Body() createPublicationDto: CreatePublicationDto, @Body('userId') userId: string) {
    return this.publicationsService.create(createPublicationDto, userId);
  }

}
