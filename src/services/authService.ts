import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { firebaseAuth } from '../firebase/firebase.config';
import { User } from '../models/User';
import { LocalStorageProvider } from '../storage/LocalStorageProvider';
import { store } from '../store/store';
import { setUser } from '../store/userSlice';
import { userService } from './userService';

const storage = new LocalStorageProvider();

class AuthService {
  private readonly userKey = 'user';
  private readonly firebaseTokenKey = 'firebaseToken';

  async loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: 'select_account',
    });

    return this.loginWithProvider(provider);
  }

  async loginWithGithub(): Promise<User> {
    const provider = new GithubAuthProvider();

    provider.addScope('user:email');
    provider.setCustomParameters({
      allow_signup: 'false',
    });

    return this.loginWithProvider(provider);
  }
  private async loginWithProvider(
    provider: GoogleAuthProvider | GithubAuthProvider,
  ): Promise<User> {
    const result = await signInWithPopup(firebaseAuth, provider);
    const firebaseUser = result.user;
    console.log('Firebase email:', firebaseUser.email);
    if (!firebaseUser.email) {
      await this.logout();

      throw new Error('La cuenta autenticada no tiene email.');
    }

    const users = await userService.searchUsers({
      email: firebaseUser.email,
    });

    const backendUser = users[0];

    if (!backendUser) {
      await this.logout();

      throw new Error('El usuario no existe en el sistema académico.');
    }

    if (!backendUser.is_active) {
      await this.logout();

      throw new Error('El usuario se encuentra inactivo.');
    }

    const firebaseToken = await firebaseUser.getIdToken();

    storage.setItem(this.userKey, JSON.stringify(backendUser));

    storage.setItem(this.firebaseTokenKey, firebaseToken);

    store.dispatch(setUser(backendUser));

    return backendUser;
  }

  async logout(): Promise<void> {
    await signOut(firebaseAuth);

    storage.removeItem(this.userKey);
    storage.removeItem(this.firebaseTokenKey);

    store.dispatch(setUser(null));
  }

  getCurrentUser(): User | null {
    const storedUser = storage.getItem(this.userKey);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      storage.removeItem(this.userKey);

      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  getFirebaseToken(): string | null {
    return storage.getItem(this.firebaseTokenKey);
  }
}

export const authService = new AuthService();
