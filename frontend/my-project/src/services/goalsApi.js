import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const goalsApi = createApi({
  reducerPath: "goalsApi",
  baseQuery,
  tagTypes: ["Goals"],
  

  endpoints: (builder) => ({
    getGoals: builder.query({
      query: () => "/goals",
      providesTags: ["Goals"],
    }),
    deleteGoal: builder.mutation({
      query: (goal_id) => ({
        url: `/goals/${goal_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Goals"],
    }),
  }),
});

export const { useGetGoalsQuery, useDeleteGoalMutation } = goalsApi;
