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
      <div className="flex flex-col border-2 border-black/80">
        <div>
          <div className="flex flex-row items-center space-x-2">
            <img
              src={sender.profilePicture}
              alt="profile"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col">
              <p>{sender.name}</p>
              <p>{sender.username}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <p>{answer.content}</p>
            <p>{answer.createdAt}</p>
          </div>
        </div>
      </div>
    </>
  );
}
