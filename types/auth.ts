import User from "./users";

export interface LoginResponse {
  status: any;
  message: string;
  data: User;
  token: string;
}

export interface LogoutRequest {
  token: any;
}