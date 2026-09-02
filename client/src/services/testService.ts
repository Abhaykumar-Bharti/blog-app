import api from './api';

interface DBTestResult {
  connected: boolean;
  error?: string;
  details?: string;
}

// Function to test Database connection
export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    const response = await api.get('/test-db');
    return response.data.connected;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};

// More comprehensive test with detailed results
export const testFirestoreConnectionDetailed = async (): Promise<DBTestResult> => {
  try {
    const response = await api.get('/test-db');
    return response.data;
  } catch (error: any) {
    console.error('Detailed database connection test failed:', error);
    
    return {
      connected: false,
      error: error.response?.data?.error || error.message || 'Unknown database connection error',
      details: error.response?.data?.details || 'Verify that the backend Node server and MongoDB are running.'
    };
  }
};