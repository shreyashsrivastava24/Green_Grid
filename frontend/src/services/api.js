const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Generic helper for GreenGrid REST API calls.
 */
async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('greengrid_access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      console.warn(`[GreenGrid API] ${options.method || 'GET'} ${endpoint} returned status ${res.status}`);
      return null;
    }

    const json = await res.json();
    if (json.success && json.data !== undefined) {
      return json.data;
    }
    return json;
  } catch (err) {
    console.info(`[GreenGrid API] Backend at ${API_BASE} currently offline or unreachable. Using cached state.`);
    return null;
  }
}

export const api = {
  // Authentication
  auth: {
    login: async (email, password) => {
      const res = await fetchApi('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res?.tokens?.access) {
        localStorage.setItem('greengrid_access_token', res.tokens.access);
        localStorage.setItem('greengrid_refresh_token', res.tokens.refresh);
      }
      return res;
    },
    demoLogin: async (email = 'arjun.s@greengrid.internal') => {
      const res = await fetchApi('/auth/demo/', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      if (res?.tokens?.access) {
        localStorage.setItem('greengrid_access_token', res.tokens.access);
        localStorage.setItem('greengrid_refresh_token', res.tokens.refresh);
      }
      return res;
    },
    getProfile: () => fetchApi('/auth/me/'),
  },

  // Facility Management
  facilities: {
    getAll: () => fetchApi('/facilities/'),
    getById: (id) => fetchApi(`/facilities/${id}/`),
    create: (facility) =>
      fetchApi('/facilities/', {
        method: 'POST',
        body: JSON.stringify(facility),
      }),
    update: (id, facility) =>
      fetchApi(`/facilities/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(facility),
      }),
    delete: (id) =>
      fetchApi(`/facilities/${id}/`, {
        method: 'DELETE',
      }),
  },

  // Alerts
  alerts: {
    getAll: () => fetchApi('/alerts/'),
    updateStatus: (id, status) =>
      fetchApi(`/alerts/${id}/`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
    triggerTest: () =>
      fetchApi('/alerts/test/', {
        method: 'POST',
      }),
    checkRules: () =>
      fetchApi('/alerts/check/', {
        method: 'POST',
      }),
  },

  // Recommendations
  recommendations: {
    getAll: () =>
      fetchApi('/recommendations/').then((res) =>
        res ? res.recommendations : null
      ),
    toggleApplied: (id, isApplied) =>
      fetchApi(`/recommendations/${id}/`, {
        method: 'PUT',
        body: JSON.stringify({ isApplied }),
      }),
    generate: () =>
      fetchApi('/recommendations/generate/', {
        method: 'POST',
      }),
  },

  // Billing
  billing: {
    getAll: () =>
      fetchApi('/billing/').then((res) =>
        res ? res.bills : null
      ),
    getSummary: () =>
      fetchApi('/billing/'),
  },

  // Dashboard & Analytics
  dashboard: {
    getData: () => fetchApi('/dashboard/'),
  },
  analytics: {
    getData: (timeframe = '30d', facilityId) => {
      const q = new URLSearchParams({ timeframe });
      if (facilityId) q.append('facility_id', facilityId);
      return fetchApi(`/analytics/?${q.toString()}`);
    },
  },
  renewables: {
    getData: () => fetchApi('/renewables/'),
  },
};
