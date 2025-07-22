export interface User {
  username: string;
  email: string;
  avatar: string;
}

export type NewUser = {
  email: string;
  password: string;
};


export type UserRes = {
  user: User;
  token: string;
};

export type UpdateUserProps = {
  name?: string;
  email?: string;
  password?: string;
};
