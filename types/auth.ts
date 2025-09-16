export interface LoginResponse {
  login: {
    authToken: string;
    user: {
      id: string;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface LoginVariables {
  input: {
    username: string;
    password: string;
  };
}