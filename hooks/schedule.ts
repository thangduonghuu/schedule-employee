import { useQuery } from "@tanstack/vue-query";
import { getUserSchedule } from "~/api/schedule";
import { QUERY_KEYS } from "~/utils/lookup/query-key";

export const useFetchSchedule = (query: any) => {
  const { data, isError, error, refetch, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.schedule.all, query],
    queryFn: () => getUserSchedule(query.value),
    enabled: query.value !== null,
    staleTime: 1000 * 60 * 5,
  });

  return {
    data,
    isFetching,
    isError,
    error,
    refetch: refetch,
  };
};
