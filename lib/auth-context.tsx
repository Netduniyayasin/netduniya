"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { auth, db } from "./firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { UserProfile, UserRole } from "./types";
import { 
  getUserProfile, 
  createOrUpdateUser, 
  subscribeToUserProfile,
  isFirstAdminUser,
  createAdminRecord
} from "./firestore-service";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  walletBalance: number;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, fullName: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isSuperAdmin: false,
  walletBalance: 0,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  refreshProfile: async () => {},
});

const SUPER_ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@netduniya.in").toLowerCase();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Subscribe to user's profile in real-time
        unsubscribeProfile = subscribeToUserProfile(currentUser.uid, (userProfile) => {
          if (userProfile) {
            // Check if user is blocked
            if (userProfile.isActive === false && userProfile.role === 'user') {
              fbSignOut(auth);
              setProfile(null);
              setUser(null);
              alert("Your account has been suspended by the administrator. Please contact support at netduniya@gmail.com.");
              setLoading(false);
              return;
            }

            // Check if user is super admin by email
            if (currentUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL && userProfile.role !== 'super_admin') {
              createOrUpdateUser({ uid: currentUser.uid, role: 'super_admin' });
            }
            setProfile(userProfile);
          } else {
            // Create user profile in Firestore
            const isSuper = currentUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL;
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              fullName: currentUser.displayName || currentUser.email?.split('@')[0] || "NetDuniya User",
              email: currentUser.email || "",
              phoneNumber: currentUser.phoneNumber || "",
              role: isSuper ? 'super_admin' : 'user',
              walletBalance: 0,
              isActive: true,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            createOrUpdateUser(newProfile).then(() => setProfile(newProfile));
          }
          setLoading(false);
        });
      } else {
        if (unsubscribeProfile) {
          unsubscribeProfile();
          unsubscribeProfile = null;
        }
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const userProfile = await getUserProfile(cred.user.uid);
      if (userProfile && userProfile.isActive === false && userProfile.role === 'user') {
        await fbSignOut(auth);
        throw new Error("This account has been blocked or suspended by administrator. Please contact support.");
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, fullName: string, phone?: string) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      await updateProfile(cred.user, { displayName: fullName });

      // Check if there are any existing super_admin or admin accounts in Firestore
      let isFirstAdmin = false;
      try {
        isFirstAdmin = await isFirstAdminUser();
      } catch (err) {
        console.warn("Error checking admin status:", err);
      }

      const isSuper = isFirstAdmin || email.trim().toLowerCase() === SUPER_ADMIN_EMAIL;
      const initialProfile: UserProfile = {
        uid: cred.user.uid,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phone?.trim() || "",
        role: isSuper ? 'super_admin' : 'user',
        walletBalance: 0,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await createOrUpdateUser(initialProfile);

      // If Super Admin, write to the dedicated admins collection
      if (isSuper) {
        try {
          await createAdminRecord({
            uid: cred.user.uid,
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phoneNumber: phone?.trim() || "",
            role: 'super_admin',
            rules: ['all'],
            isActive: true,
            createdBy: 'system_bootstrap',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        } catch (adminErr) {
          console.warn("Error registering admin record:", adminErr);
        }
      }

      setProfile(initialProfile);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await fbSignOut(auth);
      setProfile(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await getUserProfile(user.uid);
      if (p) setProfile(p);
    }
  };

  const isSuperAdmin = profile?.role === 'super_admin' || user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL;
  const isAdmin = isSuperAdmin || profile?.role === 'admin' || profile?.role === 'service_manager' || profile?.role === 'finance_manager' || profile?.role === 'content_manager' || profile?.role === 'support_manager';
  const walletBalance = profile?.walletBalance || 0;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        isSuperAdmin,
        walletBalance,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
