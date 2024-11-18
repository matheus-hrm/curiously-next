'use server';

import { prisma } from "@/prisma/prisma";

export const getUser = async (username: string) => {
  return await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
};


export async function SendQuestion(
  content: string, 
  senderId: string,
  recipientId: string,
  isAnonymous: boolean = true
) {
  const data: any = {
    content: content,
    isAnonymous: isAnonymous,
    receiver: {
      connect: { id: recipientId },
    }
  };

  if (!isAnonymous && senderId) {
    data.author = {
      connect: { id: senderId },
    };
  }

  const question = await prisma.question.create({
    data: data,
  });

  return question;
}

export async function getUserQuestions(userId: string) {
  return await prisma.question.findMany({
    where: {
      receiverId:  userId,
    },
  });
}