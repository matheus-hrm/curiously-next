import { Card, CardContent } from '@/components/ui/card';
import { formatTime } from '@/lib/utils';
import Link from 'next/link';

type FeedCardProps = {
  sender: {
    name: string;
    username: string;
    profilePicture: string;
  };
  answer: {
    id: string;
    content: string;
    createdAt: string;
    question: {
      id: string;
      content: string;
      createdAt: string;
    };
  };
  follower: {
    name: string;
    username: string;
    profilePicture: string;
  };
};

export default function FeedAnswerCard({
  sender,
  answer,
  follower,
}: FeedCardProps) {
  return (
    <>
      <Card className="w-min-lg m-6 border-2 p-2  backdrop-blur-lg bg-white/80 border-none shadow-md">
        <CardContent>
          <div className="flex flex-col items-start justify-center  space-x-5 pt-2  ">
            <div className="flex flex-row">
              <img
                src={sender.profilePicture}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col ml-3 items-start">
                <Link href={`/${sender.username}`} className="flex flex-row">
                  <p className="hover:underline font-bold">{sender.name}</p>
                  <p className="ml-2 text-black/40">respondeu</p>
                </Link>
                <p className="text-sm text-black/40">
                  {formatTime(answer.createdAt)}
                </p>
              </div>
            </div>
            <p className="m-4 text-lg items-start">{answer.content}</p>
          </div>
          <div className="flex flex-col items-start justify-center space-x-5 bg-teal-50 px-5 py-3 border-2 rounded-lg border-teal-100">
            <div className="flex flex-row">
              <img
                src={follower.profilePicture}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col ml-3 items-start">
                <Link href={`/${follower.username}`}>
                  <p className="hover:underline font-bold">{follower.name}</p>
                </Link>
                <p className="text-sm text-black/40">
                  {formatTime(answer.question.createdAt)}
                </p>
              </div>
            </div>
            <p className="m-2 items-start">{answer.question.content}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
