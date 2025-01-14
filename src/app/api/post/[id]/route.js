import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/app/(utils)/middleware/auth";

const prisma = new PrismaClient();

async function getHandler(req, { params }) {
  const { id } = params;

  try {
    const fetchPost = await prisma.post.findUnique({
      where: {
        postId: id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        comments: {
          select: {
            comment_content: true,
            author: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
            commentId: true,
          },
        },
        likes: true,
      },
    });

    console.log(fetchPost);
    return NextResponse.json(fetchPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching the post." },
      { status: 500 }
    );
  }
}

async function putHandler(req, { params }) {
  const { id } = params;
  const { title, content, imageUrl } = await req.json();

  try {
    const updatePost = await prisma.post.update({
      where: {
        postId: id,
      },
      data: {
        title,
        content,
        imageUrl,
      },
    });

    console.log(updatePost);
    return NextResponse.json(updatePost);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occurred while updating the post." },
      { status: 500 }
    );
  }
}

async function deleteHandler(req, { params }) {
  const { id } = params;

  try {
    const deletePost = await prisma.post.delete({
      where: { postId: id },
    });

    console.log("post deleted");
    return NextResponse.json(deletePost);
  } catch (error) {
    console.log(error);
  }
}

export const PUT = authMiddleware(putHandler);
export const DELETE = authMiddleware(deleteHandler);
export const GET = getHandler;
