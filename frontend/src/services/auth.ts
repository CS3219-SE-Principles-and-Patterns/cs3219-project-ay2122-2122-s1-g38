import server from './server';
import { apiKeys } from './config';
import RefreshTokenService from './refreshToken';
import { AuthData } from '../shared/types';

export const login = async (email: string, password: string) => {
  const res = await server.post(apiKeys.auth.login, {
    email: email.toLowerCase(),
    password,
  });
  const data = res.data as any as AuthData;
  RefreshTokenService.store(data?.refreshToken || '');
  return true;
};

export const refresh = async () => {
  const refreshToken = RefreshTokenService.get();
  if (!refreshToken) {
    throw Error('No refresh token');
  }

  const res = await server.post(apiKeys.auth.refresh, {
    refreshToken,
  });
  const data = res.data as any as AuthData;
  (server.defaults.headers as any).common['Authorization'] = `Bearer ${
    data?.accessToken || ''
  }`;
  RefreshTokenService.store(data?.refreshToken || '');
  return true;
};

export const signup = async (signupDetails: {
  email: string;
  name: string;
  password: string;
}) => {
  const res = await server.post(apiKeys.auth.signup, {
    ...signupDetails,
    email: signupDetails.email.toLowerCase(),
  });
  return res.data as any as string;
};

export const logout = async () => {
  RefreshTokenService.remove();
  await server.post(apiKeys.auth.logout);
  return true;
};

export const resendConfirmationMail = async (email: string) => {
  const res = await server.post(apiKeys.auth.resendConfirm, {
    email: email.toLowerCase(),
  });
  return res.data as any as string;
};

export const verifyEmailConfirmation = async (token: string) => {
  const res = await server.post(apiKeys.auth.confirm, { token });
  return res.data as any as string;
};

export const sendPasswordReset = async (email: string) => {
  const res = await server.post(apiKeys.auth.forgetPassword, {
    email: email.toLowerCase(),
  });
  return res.data as any as string;
};

export const processPasswordReset = async (token: string, password: string) => {
  const res = await server.post(apiKeys.auth.passwordReset, {
    token,
    password,
  });
  return res.data as any as string;
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  const res = await server.post(apiKeys.auth.changePassword, {
    oldPassword,
    newPassword,
  });
  return res.data as any as string;
};
