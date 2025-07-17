export interface User {
  username: string;
  email: string;
  avatar?: string; 
}

export type NewUser = {
  email: string;
  password: string;
};

export type UserRes = {
  username: string;
  email: string;
  avatar: string;
};

export type UpdateUserProps = {
  username: string;
};