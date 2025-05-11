import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BuildingInput, AnalysisResult } from "../types";

const BASE_URL = "http://localhost:8000/api/buildings";

export const createBuilding = async (data: BuildingInput) =>
  axios.post(BASE_URL, data).then((res) => res.data);

export const analyzeBuilding = async (
  data: BuildingInput
): Promise<AnalysisResult> =>
  axios.post(`${BASE_URL}/analyze`, data).then((res) => res.data);

export const getAllBuildings = async () =>
  axios.get(BASE_URL).then((res) => res.data);

// React Query hooks
export const useCreateBuilding = () =>
  useMutation({ mutationFn: createBuilding });

export const useAnalyzeBuilding = () =>
  useMutation({ mutationFn: analyzeBuilding });

export const useGetBuildings = () =>
  useQuery({ queryKey: ["buildings"], queryFn: getAllBuildings });
