import { api, decodeJwt } from './client'
import type { LoginRequest, LoginResult, SignupConsumerRequest, SignupMerchantRequest, SignupResponse } from '@/types/api'

export async function login(body: LoginRequest): Promise<LoginResult> {
  const { accessToken } = await api.post<{ accessToken: string }>('/auth/login', body)
  const { userId, role } = decodeJwt(accessToken)
  return { accessToken, userId, role }
}

export function signupConsumer(body: SignupConsumerRequest): Promise<SignupResponse> {
  return api.post<SignupResponse>('/auth/signup/consumer', body)
}

export function signupMerchant(body: SignupMerchantRequest): Promise<SignupResponse> {
  return api.post<SignupResponse>('/auth/signup/merchant', body)
}
