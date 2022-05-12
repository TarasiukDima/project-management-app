import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { serviceURL } from '$settings/index';
import { IUser, IUserLogIn, IUserRegistration } from '$types/common';
import { RootState } from '$store/store';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${serviceURL}/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).app.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (build) => ({
    signUp: build.mutation<{ id: string }, IUserRegistration>({
      query: (body: IUserRegistration) => ({ url: 'signup', method: 'POST', body }),
    }),
    signIn: build.mutation<{ token: string }, IUserLogIn>({
      query: (body: IUserLogIn) => ({ url: 'signin', method: 'POST', body }),
    }),
    // this is the sample of query with common header (prepareHeaders)
    getAllUsers: build.query<IUser, void>({
      query: () => ({
        url: 'users',
      }),
    }),
  }),
});

export const { useSignUpMutation, useSignInMutation, useGetAllUsersQuery } = api;