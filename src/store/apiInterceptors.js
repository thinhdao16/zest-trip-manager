import axios from 'axios';
import jwt_decode from 'jwt-decode';

export const BASE_URL = 'https://zesttravel.monoinfinity.net';

const getTokenFromLocalStorage = () => {
  const token = localStorage.getItem('access_token');
  return token;
};

const getRefreshTokenFromLocalStorage = () => {
  const token = localStorage.getItem('refresh_token');
  return token;
};

export const isTokenExpired = (tokenPayload) => {
  try {
    const decodedToken = jwt_decode(tokenPayload);
    const expirationTimeInSeconds = decodedToken.exp;
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    return expirationTimeInSeconds < currentTimeInSeconds;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

const refreshToken = async () => {
  // eslint-disable-next-line no-shadow
  const refreshToken = getRefreshTokenFromLocalStorage();
  if (refreshToken) {
    try {
      const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      const newAccessToken = refreshResponse.data.data.access_token;
      localStorage.setItem('access_token', newAccessToken);
      const newRefreshToken = refreshResponse.data.data.refresh_token;
      localStorage.setItem('refresh_token', newRefreshToken);
      return newAccessToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      throw new Error('Failed to refresh access token');
    }
  } else {
    throw new Error('No refresh token available');
  }
};

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = getTokenFromLocalStorage();
    const refreshTokenUse = getRefreshTokenFromLocalStorage();
    if (accessToken) {
      if (isTokenExpired(accessToken)) {
        const newAccessToken = await refreshToken();
        config.headers.Authorization = `Bearer ${newAccessToken}`;
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } else if (refreshTokenUse) {
      const newAccessToken = await refreshToken();
      config.headers.Authorization = `Bearer ${newAccessToken}`;
    } else {
      console.log('dont find token');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
