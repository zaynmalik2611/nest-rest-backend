import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostDB } from '@prisma/client';
import { PostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { title, content, userId } = createPostDto;
    return await this.prisma.post.create({
      data: {
        title,
        content,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll(): Promise<PostDto[]> {
    const posts = await this.prisma.post.findMany({
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    const postsData: PostDto[] = posts.map((post: any) => {
      post.commentsCount = post._count.comments;
      delete post._count;
      return post;
    });
    return postsData;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }

  async remove(id: number): Promise<Post> {
    return await this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
