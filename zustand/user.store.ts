import { User } from '@/constants/Types';
import { create } from 'zustand';

export const useUserInfoStore = create<{
  auth: IAuth,
  setUserInfo: (userInfo: Partial<User>) => void,
  setToken: (token: string) => void,
  setAuth: (auth: IAuth) => void,
}>(set => ({
  auth: {
    token: '',
    user: {
      _id: '',
      email: '',
      phone: '',
      fullname: '',
      address: [],
      role: 'User',
      avatar: '',
      createdAt: '',
      updatedAt: '',
    }
  },
  setUserInfo: (newUserInfo: Partial<User>) =>
    set((state) => {
      return ({ auth: { ...state.auth, user: { ...state.auth.user, ...newUserInfo } } });
    }),
  setToken: (token: string) =>
    set((state) =>
      ({ auth: { ...state.auth, token } })),
  setAuth: (newAuth: IAuth) =>
    set((state) =>
      ({ auth: newAuth })),
}));

export type IAuth = {
  token: string;
  user: User;
}