import { API_URL } from './constans';

const fetcher = (URL, param) => {
  if (param !== undefined) {
    return fetch(URL, param);
  }
  return fetch(API_URL)
    .then((data) => data.json())
    .then((data) => data);
};

export const getDataFromApi = () => {
  return fetcher();
};

export const addTaskToApi = (task) => {
  return fetcher(API_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
};

export const deleteTaskToApi = (taskId) => {
  fetcher(`${API_URL}/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
