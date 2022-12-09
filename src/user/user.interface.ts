export interface UserData {
  username: string;
  email: string;
  token: string;
  bio: string;
  image?: string;
}

export interface UserRO {
  user: UserData;
}

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  exp: number;
  iat: number;
}
