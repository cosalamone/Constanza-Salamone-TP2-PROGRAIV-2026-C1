import { Controller, Get, Post, Put, Delete, Body, Query, Param, UseGuards, Request } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request as ExpressRequest } from 'express';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPublicationDto: CreatePublicationDto, @Request() req: ExpressRequest) {
    const user = req.user!;
    return this.publicationsService.create(createPublicationDto, user.sub);
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

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() dto: CreateCommentDto, @Request() req: ExpressRequest) {
    const user = req.user!;
    return this.publicationsService.addComment(id, dto, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/comments/:commentId')
  editComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
    @Request() req: ExpressRequest,
  ) {
    const user = req.user!;
    return this.publicationsService.editComment(id, commentId, dto, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  addLike(@Param('id') id: string, @Request() req: ExpressRequest) {
    const user = req.user!;
    return this.publicationsService.addLike(id, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  removeLike(@Param('id') id: string, @Request() req: ExpressRequest) {
    const user = req.user!;
    return this.publicationsService.removeLike(id, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: ExpressRequest) {
    const user = req.user!;
    return this.publicationsService.remove(id, user.sub);
  }
}
