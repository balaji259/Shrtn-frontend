
import { useQuery } from '@tanstack/react-query';
import api from "../api/api"




export const useFetchMyShortUrls = (token, onError) => {
  return useQuery({
    queryKey: ["my-shortenurls", token],
    queryFn: async () => {
      const response = await api.get("/api/urls/myurls", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });
      return response;
    },
    select: (data) => {
      const sortedData = data.data.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      return sortedData;
    },
    onError,
    staleTime: 5000,
  });
};

export const useFetchTotalClicks = (token, onError) => {
  return useQuery({
    queryKey: ["url-totalclick", token],
    queryFn: async () => {
      const response = await api.get(
        "/api/urls/totalClicks?startDate=2024-01-01&endDate=2025-12-31",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      
      return response;
    },
    select: (data) => {
      const convertToArray = Object.keys(data.data).map((key) => ({
        clickDate: key,
        count: data.data[key],
      }));
      console.log(convertToArray)
      return convertToArray;
    },
    onError,
    staleTime: 5000,
  });
};
