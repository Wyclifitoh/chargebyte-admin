// lib/api/index.ts
const API_URL = "https://api.chargebyte.io/api";

const api = {
  get: async (endpoint: string, config?: any) => {
    const queryString = config?.params
      ? `?${new URLSearchParams(config.params).toString()}`
      : "";
    const response = await fetch(`${API_URL}${endpoint}${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
      ...config,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  },

  post: async (endpoint: string, data: any, config?: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
      body: JSON.stringify(data),
      ...config,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  },

  put: async (endpoint: string, data: any, config?: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
      body: JSON.stringify(data),
      ...config,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  },

  delete: async (endpoint: string, config?: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
      ...config,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  },
};

export default api;
