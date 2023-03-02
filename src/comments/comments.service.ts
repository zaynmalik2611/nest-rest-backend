import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '@prisma/client';
import { FindCommentsByPostQuery } from './dto/find-comments-by-post.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { content, userId, postId } = createCommentDto;

    return await this.prisma.comment.create({
      data: {
        content,
        user: {
          connect: {
            id: userId,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
    });
  }

  findAll() {
    return `This action returns all comments`;
  }

  async findCommentsByPost(query: FindCommentsByPostQuery): Promise<Comment[]> {
    const { skip, take, postId } = query;
    return await this.prisma.comment.findMany({
      where: {
        postId,
      },
      skip: skip,
      take: take,
    });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  async remove(id: number): Promise<Comment> {
    return await this.prisma.comment.delete({
      where: {
        id,
      },
    });
  }
}
