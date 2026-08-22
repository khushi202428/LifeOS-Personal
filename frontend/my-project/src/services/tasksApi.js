import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery,
  tagTypes: ["Tasks"],

  endpoints: (builder) => ({

    /* -----------------------------
       GET ALL TASKS
    ------------------------------ */
    getTasks: builder.query({
      query: () => "/tasks",
      providesTags: ["Tasks"],
    }),

    /* -----------------------------
       GET TASKS BY GOAL
    ------------------------------ */
    getTasksByGoal: builder.query({
      query: (goalId) => `/tasks/by-goal/${goalId}`,
      providesTags: ["Tasks"],
    }),

    /* -----------------------------
       CREATE TASK
    ------------------------------ */
    createTask: builder.mutation({
      query: (payload) => ({
        url: "/tasks/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Tasks"],
    }),

    /* -----------------------------
       UPDATE TASK
    ------------------------------ */
    updateTask: builder.mutation({
      query: ({ task_id, ...payload }) => ({
        url: `/tasks/${task_id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Tasks"],
    }),

    /* -----------------------------
       DELETE TASK
    ------------------------------ */
    deleteTask: builder.mutation({
      query: (task_id) => ({
        url: `/tasks/${task_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),

  }),
});

export const {
  useGetTasksQuery,
  useGetTasksByGoalQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
