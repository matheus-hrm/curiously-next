'use server';

import { prisma } from "@/prisma/prisma";

export const getUser = async (name: string) => {
  return await prisma.user.findFirst({
    where: {
      name: name,
    },
  });
};


export async function SendQuestion(content: string, senderId: string) {
  const question = await prisma.question.create({
    data: {
      content: content,
      isAnonymous: false,
      author: {
        connect: { id: senderId }
      },
    },
  });
  return question;
}

export async function getUserQuestions(userId: string) {
  return await prisma.question.findMany({
    where: {
      authorId: userId,
    },
  });
}