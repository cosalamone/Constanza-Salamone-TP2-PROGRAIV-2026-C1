export interface IPublicationUser {
  name: string;
  lastName: string;
  username?: string;
  profileImage?: string;
}

export interface IComment {
  id: string;
  text: string;
  user: IPublicationUser;
  createdAt: Date;
  modified: boolean;
}

export interface IPublication {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  user: IPublicationUser;
  likes: number;
  comments: IComment[];
  createdAt: Date;
  isLikedByCurrentUser: boolean;
  userId: string;
  _deleted?: boolean;
}
