import { Controller, Get, Post, Put, Delete, Body, Query, Param } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string, @Query('currentUserId') currentUserId: string) {
    return this.publicationsService.findOne(id, currentUserId);
  }

  @Get(':id/comments')
  getComments(
    @Param('id') id: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.publicationsService.getComments(
      id,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() dto: CreateCommentDto) {
    return this.publicationsService.addComment(id, dto);
  }

  @Put(':id/comments/:commentId')
  editComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.publicationsService.editComment(id, commentId, dto);
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
