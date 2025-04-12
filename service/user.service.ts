import { User } from "@/constants/Types"
import { api } from "@/utils/restApiUtil"
import { useUserInfoStore } from "@/zustand/user.store"


export const getUserInfo = async (setUser: (user: Partial<User>) => void) => {
  const res = await api.get<{ user: Partial<User> }>('/user/me')

  if (res.success) {
    setUser(res.data?.user ?? {} as User)
  }

  return res.data || {} as User
}