export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  phone?: string;
  image?: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data: {
    user: IUser;
    token: string;
    refreshToken: string;
  };
}

export interface IRegisterData {
  name: string;
  email: string;
  password?: string;
}

export interface ILoginCredentials {
  email: string;
  password?: string;
}
