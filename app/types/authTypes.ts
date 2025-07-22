export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  password_confirmation: string;
  hostname: string;
}

export interface UpdateProfileForm {
  email: string;
}

export interface UpdatePasswordForm {
  current_password?: string;
  password: string;
  password_confirmation: string;
}

export interface FormErrors {
  email: string[];
  password: string[];
  current_password?: string[];
  login: string[];
  secret_question: string[];
  password_confirmation: string[];
  global: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
  has_password?: boolean;
}

export interface ApiResponseUser {
  access_token: string;
  user: User;
}

export interface ApiError {
  status: number;
  data: {
    errors: {
      email: string[];
      password: string[];
      password_confirmation: string[];
    };
  };
  message: string;
}
