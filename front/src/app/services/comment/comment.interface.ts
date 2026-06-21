export interface CommentRequest {
  text: string;
}

export interface CommentResponse {
  id: string;
  text: string;
  user: {
    name: string;
    lastName: string;
    username: string;
    profileImage: string;
  };
  createdAt: Date;
  modified: boolean;
}

export interface CommentsPageResponse {
  comments: CommentResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
