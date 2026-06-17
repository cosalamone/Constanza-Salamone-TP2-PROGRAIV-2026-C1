import { Controller, Get, Post, Delete, Body, Query, Param } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  create(@Body() createPublicationDto: CreatePublicationDto, @Body('userId') userId: string) {
    return this.publicationsService.create(createPublicationDto, userId);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sort') sort: string,
    @Query('userId') userId: string,
    @Query('currentUserId') currentUserId: string,
  ) {
    return this.publicationsService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: sort || 'date',
      userId,
      currentUserId,
    });
  }

  @Post(':id/like')
  addLike(@Param('id') id: string, @Body('userId') userId: string) {
    return this.publicationsService.addLike(id, userId);
  }

  @Delete(':id/like')
  removeLike(@Param('id') id: string, @Query('userId') userId: string) {
    return this.publicationsService.removeLike(id, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.publicationsService.remove(id, userId);
  }
}
