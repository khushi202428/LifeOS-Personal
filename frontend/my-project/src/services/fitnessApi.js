import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const fitnessApi = createApi({
  reducerPath: "fitnessApi",
  baseQuery, 
  endpoints: (builder) => ({
    getWeeklyFitnessRoutine: builder.query({
      query: () => ({
        url: "/fitness/weekly-routine",
      }),
      // Do not retain an earlier 404 after a plan has been approved.
      keepUnusedDataFor: 0,
    }),
    updateFitnessProgress: builder.mutation({
      query: (body) => ({ url: "/fitness/weekly-routine/progress", method: "PATCH", body }),
    }),
  }),
});

export const {
  useGetWeeklyFitnessRoutineQuery,
  useUpdateFitnessProgressMutation,
} = fitnessApi;
