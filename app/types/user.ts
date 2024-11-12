export type User = {
    id: string;
    username: string;
    name: string;
    email: string;
    bio: string;
    profilePicture: string;
    socials: {
        discord?: string;
        twitter?: string;
    }
    createdAt: string;
    Questions: {
        id: string;
        title: string;
        body: string;
        tags: string[];
        createdAt: string;
    }[]
    Answers: {
        id: string;
        body: string;
        createdAt: string;
        Question: {
            id: string;
            title: string;
        }
    }[]
}