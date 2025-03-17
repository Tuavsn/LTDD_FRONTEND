import { api } from "@/utils/restApiUtil"
import { IUserInfo, useUserInfoStore } from "@/zustand/user.store"


export const getUserInfo = async (setUser: (user: Partial<IUserInfo>) => void) => {
  const res = await api.get<{ user: Partial<IUserInfo> }>('/user/me', { requiresAuth: true })

  if (res.success) {
    setUser(res.data?.user ?? {} as IUserInfo)
  }

  return res.data || {} as IUserInfo
}