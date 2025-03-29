import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { isTokenExpired } from '@/lib/utils';

// Define types for our state
interface User {
  id: string;
  name: string;
  email: string;
}

export interface TokenType {
  access_token: string;
  refresh_token: string;
}

interface AuthState {
  user: User | null;
  token: TokenType | null;
  isAuthenticated: boolean;
  isTokenExpired: boolean;
  clientId: string | null;
}

// Define the initial state without accessing cookies
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isTokenExpired: false,
  clientId: null
};

// Secure cookie settings
const SECURE_COOKIE_OPTIONS = {
  expires: 2, // 7 days
  secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
  path: '/' // Available across the entire site
};

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Hydrate the state from cookies on client-side
    hydrate: (state) => {
      // Only run on client side
      if (typeof window !== 'undefined') {
        // Retrieve token from cookie
        const tokenFromCookie = Cookies.get('token');

        // Retrieve client ID from cookie
        const clientIdFromCookie = Cookies.get('x-client-id');
        console.log('MesssageToken...', {
          tokenFromCookie,
          clientIdFromCookie
        });
        if (tokenFromCookie) {
          try {
            const parsedToken = JSON.parse(tokenFromCookie) as TokenType;

            // Check if token is already expired
            if (isTokenExpired(parsedToken.access_token)) {
              // Token expired, clean up
              Cookies.remove('token');
              Cookies.remove('x-client-id');
              state.isTokenExpired = true;
              return;
            }

            state.token = parsedToken;
            state.isAuthenticated = true;
            state.isTokenExpired = false;

            // Set the client ID if available
            if (clientIdFromCookie) {
              try {
                state.clientId = JSON.parse(clientIdFromCookie);
              } catch (e) {
                // If not valid JSON, use as string directly
                state.clientId = clientIdFromCookie;
              }
            }

            // If we have a user ID from cookie but no user object yet
            if (clientIdFromCookie && !state.user) {
              let userId: string;

              try {
                userId = JSON.parse(clientIdFromCookie);
              } catch (e) {
                // If not valid JSON, use as string directly
                userId = clientIdFromCookie;
              }

              // Create minimal user object until full user data can be fetched
              state.user = {
                id: userId,
                name: 'User', // Placeholder
                email: '' // Placeholder
              };
            }
          } catch (e) {
            // Invalid token format, remove it
            Cookies.remove('token');
            Cookies.remove('x-client-id');
          }
        }
      }
    },

    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: TokenType }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isTokenExpired = false;
      state.clientId = action.payload.user.id;

      // Save data to cookies for persistence
      if (typeof window !== 'undefined') {
        Cookies.set(
          'token',
          JSON.stringify(action.payload.token),
          SECURE_COOKIE_OPTIONS
        );
        Cookies.set(
          'x-client-id',
          action.payload.user.id,
          SECURE_COOKIE_OPTIONS
        );
      }
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.clientId = action.payload.id;

      // Update client ID cookie when user is set
      if (typeof window !== 'undefined') {
        Cookies.set('x-client-id', action.payload.id, SECURE_COOKIE_OPTIONS);
      }
    },

    checkTokenExpiration: (state) => {
      if (
        state.token?.access_token &&
        isTokenExpired(state.token.access_token)
      ) {
        state.isTokenExpired = true;
      }
    },

    setToken: (state, action: PayloadAction<TokenType>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.isTokenExpired = false;

      // Save token to cookies
      if (typeof window !== 'undefined') {
        Cookies.set(
          'token',
          JSON.stringify(action.payload),
          SECURE_COOKIE_OPTIONS
        );
      }
    },

    setClientId: (state, action: PayloadAction<string>) => {
      state.clientId = action.payload;

      // Save client ID to cookies
      if (typeof window !== 'undefined') {
        Cookies.set('x-client-id', action.payload, SECURE_COOKIE_OPTIONS);
      }
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.isTokenExpired = false;
      state.clientId = null;

      // Remove cookies
      if (typeof window !== 'undefined') {
        Cookies.remove('token');
        Cookies.remove('x-client-id');
      }
    }
  }
});

// Export actions and reducer
export const {
  loginSuccess,
  logout,
  hydrate,
  setUser,
  setClientId,
  checkTokenExpiration,
  setToken
} = authSlice.actions;

export default authSlice.reducer;
