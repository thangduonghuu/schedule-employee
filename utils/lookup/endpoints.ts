import { isArray } from "lodash";

const parseParams = (params?: any): string => {
  if (!params) return "";
  // all key value pair that have undefined will be remove
  Object.keys(params).forEach((key) => {
    if (params[key] === undefined) delete params[key];
  });
  const keys = Object.keys(params);
  if (keys.length === 0) return "";
  return `?${keys
    .map((key) => {
      if (isArray(params[key])) {
        let paramsList = "";
        params[key].forEach((value: string) => {
          paramsList += `&${key}[]=${encodeURIComponent(value)}`;
        });
        return paramsList.length ? paramsList : `${key}[]=`;
      }
      return `${key}=${encodeURIComponent(params[key])}`;
    })
    .filter((item) => !!item)
    .join("&")}`;
};

export const ENDPOINTS = Object.freeze({
  schedule: {
    query: (query: any) => `/schedule/${query}`,
    create: "/schedule",
  },
  auth: {
    signIn: "/auth/login",
    signUp: "/user",
  },
});
