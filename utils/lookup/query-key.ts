const schedule = {
  all: ["schedule"] as const,
  schedule: (params: any) => [...schedule.schedules(), { params }] as const,
  schedules: () => [...schedule.all, "schedule"] as const,
};

export const QUERY_KEYS = Object.freeze({
  schedule,
});
