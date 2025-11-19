import { API_BASE_URL } from './config';
import { fetchWithAuth } from './fetchWithAuth';

export async function getOrders(filters: any) {
  // Build query string from filters
  const queryParams = new URLSearchParams();
  
  // Add all filter parameters
  if (filters.date) queryParams.append('date', filters.date);
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.machineId) queryParams.append('machineId', filters.machineId);
  if (filters.customerId) queryParams.append('customerId', filters.customerId);
  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());
  if (filters.search) queryParams.append('search', filters.search);
  
  const url = `${API_BASE_URL}/orders?${queryParams.toString()}`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch orders');
  }

  return res.json();
}

export async function getOrderStats(filters: any) {
  const queryParams = new URLSearchParams();
  
  if (filters.date) queryParams.append('date', filters.date);
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.machineId) queryParams.append('machineId', filters.machineId);
  
  const url = `${API_BASE_URL}/orders/stats?${queryParams.toString()}`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch order statistics');
  }

  return res.json();
}

export async function getFilterOptions() {
  const url = `${API_BASE_URL}/orders/filters`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch filter options');
  }

  return res.json();
}

export async function getOrderById(orderId: string) {
  const url = `${API_BASE_URL}/orders/${orderId}`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch order');
  }

  return res.json();
}

export async function getAllCustomerAnalytics() {
  const url = `${API_BASE_URL}/customer-analytics/all`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch customer analytics');
  }

  return res.json();
}

export async function getDashboardData() {
  const url = `${API_BASE_URL}/customer-analytics/dashboard`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch dashboard data');
  }

  return res.json();
}

export async function getTotalCustomers() {
  const url = `${API_BASE_URL}/customer-analytics/total-customers`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch total customers');
  }

  return res.json();
}

export async function getRepeatCustomers() {
  const url = `${API_BASE_URL}/customer-analytics/repeat-customers`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch repeat customers');
  }

  return res.json();
}

export async function getWomenPercentage() {
  const url = `${API_BASE_URL}/customer-analytics/women-percentage`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch women percentage');
  }

  return res.json();
}

export async function getCustomerDemographics() {
  const url = `${API_BASE_URL}/customer-analytics/demographics`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch customer demographics');
  }

  return res.json();
}

export async function getCustomerGrowth() {
  const url = `${API_BASE_URL}/customer-analytics/growth`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch customer growth');
  }

  return res.json();
}

export async function getCustomerLoyalty() {
  const url = `${API_BASE_URL}/customer-analytics/loyalty`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch customer loyalty');
  }

  return res.json();
}

// Filter options constants for easy use in components
export const DATE_FILTERS = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last7days',
  LAST_30_DAYS: 'last30days',
  CUSTOM: 'custom'
};

export const STATUS_FILTERS = {
  ALL: 'all',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};