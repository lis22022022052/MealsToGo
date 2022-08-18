import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export const loginRequest = (email, password) =>
  signInWithEmailAndPassword(getAuth(), email, password);

export const registerRequest = (email, password) =>
  createUserWithEmailAndPassword(getAuth(), email, password);

export const useAuthStateChanged = (hook) =>
  onAuthStateChanged(getAuth(), (user) => hook(user));

export const logout = () => signOut(getAuth());
