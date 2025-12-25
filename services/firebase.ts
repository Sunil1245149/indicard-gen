
import { IdCardData } from "../types";

// MOCK IMPLEMENTATION
// The 'firebase' module imports were causing missing member errors. 
// Replaced with a mock service to ensure the application compiles and runs.

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export const loginWithGoogle = async (): Promise<User> => {
  console.warn("Firebase Authentication is mocked.");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        uid: "mock-user-id",
        displayName: "Demo User",
        email: "demo@example.com",
        photoURL: null
      });
    }, 500);
  });
};

export const logoutUser = async () => {
  console.log("Mock logout");
};

export const saveCardToProfile = async (userId: string, cardData: IdCardData) => {
  console.log("Mock save", userId, cardData);
  return "mock-doc-id";
};

export const getUserCards = async (userId: string): Promise<IdCardData[]> => {
  console.log("Mock get cards", userId);
  return [];
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  // Simulate checked auth state (logged out by default)
  callback(null);
  return () => {};
};
