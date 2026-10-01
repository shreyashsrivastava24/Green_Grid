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

    let json;
    try {
      json = await res.json();
    } catch {
      json = null;
    }

    if (!res.ok) {
      const message = json?.message || `Request failed with status ${res.status}.`;
      const error = {
        status: res.status,
        message,
        errors: json?.errors || null,
        endpoint,
      };
      console.warn(`[GreenGrid API] ${options.method || 'GET'} ${endpoint} returned status ${res.status}: ${message}`);
      throw error;
    }

    if (json && json.success === false) {
      throw {
        status: res.status || 400,
        message: json.message || 'The server returned an unsuccessful response.',
        errors: json.errors || null,
        endpoint,
      };
    }

    if (json && json.success !== undefined && json.data !== undefined) {
      return json.data;
    }
    return json;
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      throw err;
    }

    const networkError = {
      status: 'network',
      message: 'Unable to reach the GreenGrid backend. Please check the server connection and try again.',
      errors: null,
      endpoint,
    };
    console.info(`[GreenGrid API] Backend at ${API_BASE} currently offline or unreachable.`);
    throw networkError;
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
    logout: () => {
      localStorage.removeItem('greengrid_access_token');
      localStorage.removeItem('greengrid_refresh_token');
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
