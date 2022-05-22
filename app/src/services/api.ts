import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { serviceURL } from '$settings/index';
import {
  IBoard,
  IBoardCreateObj,
  IColumn,
  IColumnCreateObj,
  ITask,
  ITaskCreateObj,
  IUser,
  IUserLogIn,
  IUserRegistration,
} from '$types/common';
import { RootState } from '$store/store';

enum QueryPoints {
  signup = 'signup',
  signin = 'signin',
  users = 'users',
  boards = 'boards',
  columns = 'columns',
  tasks = 'tasks',
}

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
  tagTypes: ['Boards', 'Columns', 'Tasks', 'Users'],
  endpoints: (build) => ({
    // user
    signUp: build.mutation<{ id: string }, IUserRegistration>({
      query: (body: IUserRegistration) => ({ url: QueryPoints.signup, method: 'POST', body }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    signIn: build.mutation<{ token: string }, IUserLogIn>({
      query: (body: IUserLogIn) => ({ url: QueryPoints.signin, method: 'POST', body }),
    }),
    getAllUsers: build.query<Array<IUser>, void>({
      query: () => ({
        url: QueryPoints.users,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    deleteUser: build.mutation<void, string>({
      query: (id) => ({ url: `${QueryPoints.users}/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    updateUser: build.mutation<IUser, { body: IUserRegistration; id: string }>({
      query: ({ body, id }) => ({ url: `${QueryPoints.users}/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    // boards page
    getAllBoards: build.query<Array<IBoard>, void>({
      query: () => ({
        url: QueryPoints.boards,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Boards' as const, id })),
              { type: 'Boards', id: 'LIST' },
            ]
          : [{ type: 'Boards', id: 'LIST' }],
    }),
    addBoard: build.mutation<IBoard, IBoardCreateObj>({
      query: (body: IBoardCreateObj) => ({ url: QueryPoints.boards, method: 'POST', body }),
      invalidatesTags: [{ type: 'Boards', id: 'LIST' }],
    }),
    updateBoard: build.mutation<IBoard, { body: IBoardCreateObj; id: string }>({
      query: ({ body, id }) => ({
        url: `/${QueryPoints.boards}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Boards', id: 'LIST' }],
    }),

    // columns page
    getAllColumns: build.query<Array<IColumn>, string>({
      query: (id: string) => ({
        url: `${QueryPoints.boards}/${id}/${QueryPoints.columns}`,
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Columns' as const, id })),
              { type: 'Columns', id: 'LIST' },
            ]
          : [{ type: 'Columns', id: 'LIST' }],
    }),
    addColumn: build.mutation<IColumn, { body: IColumnCreateObj; id: string }>({
      query: ({ body, id }) => ({
        url: `${QueryPoints.boards}/${id}/${QueryPoints.columns}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Columns', id: 'LIST' }],
    }),
    updateColumn: build.mutation<IColumn, { body: IUpdateTitleFormState; id: string }>({
      query: ({ body, id }) => ({
        url: `/${QueryPoints.boards}/${id}/${QueryPoints.columns}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Columns', id: 'LIST' }],
    }),

    // tasks page
    getAllTasks: build.query<Array<ITask>, { boardId: string; columnId: string }>({
      query: ({ boardId, columnId }) => ({
        url: `${QueryPoints.boards}/${boardId}/columns/${columnId}/${QueryPoints.tasks}`,
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Tasks' as const, id })),
              { type: 'Tasks', id: 'LIST' },
            ]
          : [{ type: 'Tasks', id: 'LIST' }],
    }),

    addTask: build.mutation<ITask, { body: ITaskCreateObj; boardId: string; columnId: string }>({
      query: ({ body, boardId, columnId }) => ({
        url: `${QueryPoints.boards}/${boardId}/columns/${columnId}/${QueryPoints.tasks}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetAllBoardsQuery,
  useAddBoardMutation,
  useUpdateBoardMutation,
  useGetAllColumnsQuery,
  useAddColumnMutation,
  useUpdateColumnMutation,
  useGetAllTasksQuery,
  useAddTaskMutation,
} = api;
