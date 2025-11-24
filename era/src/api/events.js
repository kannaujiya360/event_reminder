import API from './auth';

// Create event (JSON)
export const createEvent = (data) => {
  return API.post('/api/events', data);
};


export const getEvents = (status) =>
  API.get('/api/events' + (status ? `?status=${status}` : ''));


export const updateEvent = (id, data) => {

  if (data instanceof FormData) {
    return API.put(`/api/events/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  return API.put(`/api/events/${id}`, data);
};


export const deleteEvent = (id) => API.delete(`/api/events/${id}`);
