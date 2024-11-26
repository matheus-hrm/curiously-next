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
  senderId: string | null,
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

export async function getUserById(id: string) {
  return await prisma.user.findFirst({
    where: {
      id: id,
    },
  });
}

export const replyQuestion = async (
  question: { id: string; receiverId: string },
  reply: string,
) => {
  'use server';
  try {
    if (!question.receiverId) {
      throw new Error('Receiver ID is required');
    }
    await prisma.answer.create({
      data: {
        content: reply,
        authorId: question.receiverId,
        questionId: question.id,
      },
    });
  } catch (error) {
    console.error('Error replying to question', error);
  }
};

export const getAnswer = async (questionId: string) => {
  return await prisma.answer.findMany({
    where: {
      questionId: questionId,
    },
  });
}

export const getAllAnswers = async (userId : string) => {
  
  const answers = await prisma.answer.findMany({
    where: {
      authorId: userId,
    },
  });

  const answersWithUsers = await Promise.all(
    answers.map(async (answer) => {
      const user = await getUserById(answer.authorId);
      return {
        ...answer,
        user: {
          name: user?.username || '',
          profilePicture: user?.profilePicture || '',
        }
      };
    })
  );

  return answersWithUsers;

}
