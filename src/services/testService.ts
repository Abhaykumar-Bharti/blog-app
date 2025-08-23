import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../firebase/config';

interface FirestoreTestResult {
  connected: boolean;
  error?: string;
  details?: string;
}

// Function to test Firestore connection with detailed error reporting
export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Firestore connection...');
    // Try to get a limited list of comments to check connection
    const q = query(collection(db, 'comments'), limit(1));
    const querySnapshot = await getDocs(q);
    console.log('Firestore connection successful, found', querySnapshot.size, 'comments');
    return true;
  } catch (error: any) {
    console.error('Firestore connection test failed:', error);
    // Log more detailed error info
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.message) {
      console.error('Error message:', error.message);
    }
    return false;
  }
};

// More comprehensive test with detailed results
export const testFirestoreConnectionDetailed = async (): Promise<FirestoreTestResult> => {
  try {
    console.log('Performing detailed Firestore connection test...');
    
    // Try to get a limited list of comments to check connection
    const q = query(collection(db, 'comments'), limit(1));
    const querySnapshot = await getDocs(q);
    
    console.log('Firestore connection successful, found', querySnapshot.size, 'comments');
    return {
      connected: true,
      details: `Successfully connected to Firestore. Found ${querySnapshot.size} comment(s).`
    };
  } catch (error: any) {
    console.error('Detailed Firestore connection test failed:', error);
    
    // Extract error details
    let errorMessage = 'Unknown error';
    let errorDetails = '';
    
    if (error.code) {
      errorMessage = `Error code: ${error.code}`;
      
      // Interpret common Firebase error codes
      if (error.code === 'permission-denied') {
        errorDetails = 'Security rules are preventing access to the database.';
      } else if (error.code === 'unavailable') {
        errorDetails = 'The service is currently unavailable. Please check your internet connection.';
      } else if (error.code === 'failed-precondition') {
        errorDetails = 'The operation failed because a required precondition was not met.';
      } else if (error.code === 'unauthenticated') {
        errorDetails = 'User authentication is required to access this resource.';
      }
    }
    
    if (error.message) {
      errorDetails += (errorDetails ? ' ' : '') + error.message;
    }
    
    return {
      connected: false,
      error: errorMessage,
      details: errorDetails
    };
  }
}; 