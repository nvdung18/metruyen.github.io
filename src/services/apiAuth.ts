import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types for our requests and responses
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface TokenType {
  access_token: string;
  refresh_token: string;
}

export interface LoginRequest {
  usr_email: string;
  usr_password: string;
}

export interface RegisterRequest {
  usr_name: string;
  usr_email: string;
  usr_password: string;
}

// Updated to match the actual API response format
export interface ApiAuthResponse {
  status: boolean;
  statusCode: number;
  statusReason: string;
  message: string;
  timestamp: string;
  path: string;
  metadata: {
    token: {
      access_token: string;
      refresh_token: string;
    };
    user: {
      usr_id: number;
      usr_name: string;
      usr_email: string;
    };
  };
  option?: any;
}

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080'
  }),
  endpoints: (builder) => ({
    login: builder.mutation<ApiAuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      })
    }),
    register: builder.mutation<ApiAuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/user/sign-up',
        method: 'POST',
        body: userData
      })
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/me'
    })
  })
});

// Export hooks for usage in components
export const { useLoginMutation, useRegisterMutation, useGetCurrentUserQuery } =
  authApiSlice;
