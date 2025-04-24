import { useQuery } from "@tanstack/vue-query";
import { getUserSchedule } from "~/api/schedule";

export const useFetchSchedule = (query: any) => {
  const { data, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["schedule", query],
    queryFn: () => getUserSchedule(query.value),
    enabled: !!query,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    data,
    isFetching,
    isError,
    error,
    refetch: refetch,
  };
};
