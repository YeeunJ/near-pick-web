import { api } from './client'
import type { LoginRequest, LoginResult, SignupRequest, SignupResponse } from '@/types/api'

export function login(body: LoginRequest): Promise<LoginResult> {
  return api.post<LoginResult>('/auth/login', body)
}

export function signup(body: SignupRequest): Promise<SignupResponse> {
  return api.post<SignupResponse>('/auth/signup', body)
}
