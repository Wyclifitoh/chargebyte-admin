import api from "./api";

export interface ActivationFilters {
  startDate?: string;
  endDate?: string;
  county?: string;
  status?: string;
  agent?: string;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  county?: string;
  status?: string;
  reportType?: string;
}

export const getActivationStats = async () => {
  return api.get("/activations/stats");
};

export const getRecentActivations = async () => {
  return api.get("/activations/recent");
};

export const getAllActivations = async (filters?: ActivationFilters) => {
  return api.get("/activations", { params: filters });
};

export const getActivationById = async (id: string) => {
  return api.get(`/activations/${id}`);
};

export const createActivation = async (data: any) => {
  return api.post("/activations", data);
};

export const updateActivation = async (id: string, data: any) => {
  return api.put(`/activations/${id}`, data);
};

export const getReportData = async (filters?: ReportFilters) => {
  return api.get("/activations/report/data", { params: filters });
};

export const generateActivationReport = async (filters: ReportFilters) => {
  return api.get("/activations/report/export", {
    params: filters,
    responseType: "blob", // Important for file download
  });
};
