import { create } from 'zustand';

export const useUserInfoStore = create<{
  auth: IAuth,
  setUserInfo: (userInfo: Partial<IUserInfo>) => void,
  setToken: (token: string) => void,
  setAuth: (auth: IAuth) => void,
}>(set => ({
  auth: {
    token: '',
    user: {
      email: '',
      phone: '',
      fullname: '',
      avatar: '',
      role: '',
    }
  },
  setUserInfo: (newUserInfo: Partial<IUserInfo>) =>
    set((state) => {
      console.log('newUserInfo', newUserInfo);
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
  user: IUserInfo;
}

export type IUserInfo = {
  email: string;
  phone: string;
  fullname: string;
  avatar: string;
  role: string;
}