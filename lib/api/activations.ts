import api from "./index";

export interface ActivationFilters {
  startDate?: string;
  endDate?: string;
  county?: string;
  status?: string;
  agent?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  county?: string;
  status?: string;
  agent?: string;
}

export interface CreateActivationData {
  agent_id?: number;
  county: string;
  location_type: "School" | "Market" | "Institution";
  location_name: string;
  status: "Scheduled" | "Visited" | "Cancelled";
  // Change these from boolean to number if backend expects 1/0
  activity_awareness?: number; // Changed from boolean
  activity_training?: number; // Changed from boolean
  activity_demo?: number; // Changed from boolean
  giga_explained?: number; // Changed from boolean
  internet_method?: "WiFi" | "Powerbank" | "Both" | "";
  notes?: string;
  visit_date: string;
  people_reached?: number;
  male_count?: number;
  female_count?: number;
  phone_contacts?: number;
  email_contacts?: number;
}

export interface ContactData {
  full_name: string;
  phone?: string;
  email?: string;
  gender: "Male" | "Female" | "Other";
  age_range: string;
  occupation?: string;
  interests?: string;
}

// Existing activation APIs
export const getActivationStats = async () => {
  return api.get("/customer-analytics/activation/stats");
};

export const getRecentActivations = async () => {
  return api.get("/customer-analytics/activation/recent");
};

export const getAllActivations = async (filters?: ActivationFilters) => {
  return api.get("/customer-analytics/activation", { params: filters });
};

export const getActivationById = async (id: string) => {
  return api.get(`/customer-analytics/activation/${id}`);
};

export const createActivation = async (data: CreateActivationData) => {
  return api.post("/customer-analytics/activation", data);
};

export const updateActivation = async (
  id: string,
  data: Partial<CreateActivationData>,
) => {
  return api.put(`/customer-analytics/activation/${id}`, data);
};

export const getActivationStatsByCounty = async () => {
  return api.get("/customer-analytics/activation/stats/county");
};

export const getActivationStatsByLocationType = async () => {
  return api.get("/customer-analytics/activation/stats/location-type");
};

export const getActivationMonthlyTrends = async () => {
  return api.get("/customer-analytics/activation/stats/monthly-trends");
};

export const getAgentPerformance = async () => {
  return api.get("/customer-analytics/activation/stats/agent-performance");
};

export const getActivationReportData = async (filters?: ReportFilters) => {
  return api.get("/customer-analytics/activation/report/data", {
    params: filters,
  });
};

export const generateActivationReport = async (filters: ReportFilters) => {
  const baseURL =
    process.env.NEXT_PUBLIC_API_URL || "https://api.chargebyte.io/api";
  const queryString = new URLSearchParams(filters as any).toString();
  const url = `${baseURL}/customer-analytics/activation/report/export?${queryString}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute(
    "download",
    `activation-report-${new Date().toISOString().split("T")[0]}.xlsx`,
  );
  document.body.appendChild(link);
  link.click();
  link.remove();

  return { success: true };
};

// NEW: Contact Management APIs
export const addContactToActivation = async (
  activationId: string,
  contactData: ContactData,
) => {
  return api.post(
    `/customer-analytics/activation/${activationId}/contacts`,
    contactData,
  );
};

export const getActivationContacts = async (activationId: string) => {
  return api.get(`/customer-analytics/activation/${activationId}/contacts`);
};

export const updateActivationContact = async (
  contactId: string,
  contactData: Partial<ContactData>,
) => {
  return api.put(
    `/customer-analytics/activation/contacts/${contactId}`,
    contactData,
  );
};

export const deleteActivationContact = async (contactId: string) => {
  return api.delete(`/customer-analytics/activation/contacts/${contactId}`);
};

// Optional: Bulk contact operations
export const addBulkContactsToActivation = async (
  activationId: string,
  contacts: ContactData[],
) => {
  return api.post(
    `/customer-analytics/activation/${activationId}/contacts/bulk`,
    {
      contacts,
    },
  );
};

// Get contacts with filters
export const getContactsWithFilters = async (filters?: {
  activationId?: string;
  county?: string;
  startDate?: string;
  endDate?: string;
  gender?: string;
  page?: number;
  limit?: number;
}) => {
  return api.get("/customer-analytics/contacts", { params: filters });
};
