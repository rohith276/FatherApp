/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { createContext } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, getRedirectResult, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { useEffect } from 'react';
import app from '../firebase/firebase.config';
import { axiosPublic } from '../hooks/useAxiosPublic';

export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tokenReady, setTokenReady] = useState(false);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signUpWithGmail = () => {
        setLoading(true);
        // Try popup first, fall back to redirect if popup is blocked
        return signInWithPopup(auth, googleProvider).catch((error) => {
            if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
                return signInWithRedirect(auth, googleProvider);
            }
            throw error;
        });
    }

    const login = (email, password) =>{
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logOut = () =>{
        localStorage.removeItem('access-token');
        setTokenReady(false);
        return signOut(auth);
    }

    // update your profile
    const updateUserProfile = (name, photoURL) => {
      return  updateProfile(auth.currentUser, {
            displayName: name, photoURL: photoURL
          })
    }

    useEffect( () =>{
        // Handle redirect result from Google sign-in (when popup is blocked)
        getRedirectResult(auth).then((result) => {
            if (result) {
                const userInfor = {
                    name: result.user?.displayName,
                    email: result.user?.email,
                };
                axiosPublic.post('/users', userInfor).catch(() => {});
            }
        }).catch((error) => console.log("Redirect error:", error));

        const unsubscribe = onAuthStateChanged(auth, currentUser =>{
            setUser(currentUser);
            // Set loading false immediately so the UI renders
            setLoading(false);
            
            if(currentUser){
                const userInfo ={email: currentUser.email}
                axiosPublic.post('/jwt', userInfo)
                  .then( (response) => {
                    if(response.data.token){
                        localStorage.setItem("access-token", response.data.token)
                        setTokenReady(true);
                    }
                  })
                  .catch((error) => {
                    console.error("Failed to get JWT token:", error);
                  });
            } else{
               localStorage.removeItem("access-token")
               setTokenReady(false);
            }
        });

        return () =>{
            return unsubscribe();
        }
    }, [])

    const authInfo = {
        user, 
        loading,
        tokenReady,
        createUser, 
        login, 
        logOut,
        signUpWithGmail,
        updateUserProfile
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;