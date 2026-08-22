import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const subtasksApi = createApi({
  reducerPath: "subtasksApi",
  baseQuery,
  tagTypes: ["Subtasks"],

  endpoints: (builder) => ({

    /* -----------------------------
       GET SUBTASKS BY TASK
    ------------------------------ */
    getSubtasksByTask: builder.query({
      query: (taskId) => `/subtasks/by-task/${taskId}`,
      providesTags: ["Subtasks"],
    }),

    /* -----------------------------
       CREATE SUBTASK
    ------------------------------ */
    createSubtask: builder.mutation({
      query: (payload) => ({
        url: "/subtasks/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Subtasks"],
    }),

    /* -----------------------------
       COMPLETE SUBTASK
    ------------------------------ */
    completeSubtask: builder.mutation({
      query: (subtask_id) => ({
        url: `/subtasks/${subtask_id}/complete`,
        method: "POST",
      }),
      invalidatesTags: ["Subtasks", "Tasks"],
    }),

    /* -----------------------------
       DELETE SUBTASK
    ------------------------------ */
    deleteSubtask: builder.mutation({
      query: (subtask_id) => ({
        url: `/subtasks/${subtask_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subtasks", "Tasks"],
    }),

  }),
});

export const {
  useGetSubtasksByTaskQuery,
  useCreateSubtaskMutation,
  useCompleteSubtaskMutation,
  useDeleteSubtaskMutation,
} = subtasksApi;
