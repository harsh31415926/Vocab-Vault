const API_BASE = '/api';

let authToken = localStorage.getItem('vocab_vault_token') || null;

export const setToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('vocab_vault_token', token);
  } else {
    localStorage.removeItem('vocab_vault_token');
  }
};

export const getToken = () => authToken;

export const isLoggedIn = () => !!authToken;

const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) setToken(res.token);
    return res;
  },

  register: async (email, password) => {
    const res = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) setToken(res.token);
    return res;
  },

  logout: () => {
    setToken(null);
  },

  // Vocabularies CRUD
  getVocabularies: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.favorite) params.append('favorite', 'true');
    if (filters.tag) params.append('tag', filters.tag);
    
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return fetchAPI(`/vocabularies${queryStr}`);
  },

  getVocabulary: async (id) => {
    return fetchAPI(`/vocabularies/${id}`);
  },

  createVocabulary: async (vocabData) => {
    return fetchAPI('/vocabularies', {
      method: 'POST',
      body: JSON.stringify(vocabData),
    });
  },

  updateVocabulary: async (id, vocabData) => {
    return fetchAPI(`/vocabularies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vocabData),
    });
  },

  deleteVocabulary: async (id) => {
    return fetchAPI(`/vocabularies/${id}`, {
      method: 'DELETE',
    });
  },

  duplicateVocabulary: async (id) => {
    return fetchAPI(`/vocabularies/${id}/duplicate`, {
      method: 'POST',
    });
  }
};
