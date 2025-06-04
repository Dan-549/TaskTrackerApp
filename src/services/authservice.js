import { signInWithPopup, signOut } from 'firebase/auth';
import { initializeChartDataOnLogin } from './firebaseChartService';
import { auth, googleProvider } from './firebaseConfig';

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // After successful login, initialize chart data if needed
    await initializeChartDataOnLogin();
    return result;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const handleSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  return auth.currentUser !== null;
}; 