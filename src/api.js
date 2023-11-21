import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8775',
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function getTaskList() {
  try {
    const response = await apiClient.get('admin/ls');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export async function getErrorDetails(taskId) {
  try {
    const response = await apiClient.get(`/scan/error_details/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export async function getLogDetails(taskId) {
  try {
    const response = await apiClient.get(`/scan/log_details/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export async function getPayloadDetails(taskId) {
  try {
    const response = await apiClient.get(`/scan/payload_details/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export async function stopTaskApi(taskId) {
  try {
    const response = await apiClient.get(`/scan/stop/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
;
}

export async function startTaskApi(taskId) {
  try {
    const response = await apiClient.get(`/scan/startBlocked/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function killTaskApi(taskId) {
  try {
    const response = await apiClient.get(`/scan/kill/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export async function deleteTaskApi(taskId) {
  try {
    const response = await apiClient.get(`/task/delete/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export async function flushApi(taskId) {
  try {
    const response = await apiClient.get(`/admin/flush`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};