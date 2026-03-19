import type { ApiResponse, UserRole } from '@/types/api'

export function decodeJwt(token: string): { userId: number; role: UserRole } {
  const payload = JSON.parse(atob(token.split('.')[1]))
  return { userId: Number(payload.sub), role: payload.role as UserRole }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      document.cookie = 'token=; max-age=0; path=/'
      document.cookie = 'role=; max-age=0; path=/'
      window.location.href = '/login'
    }
    throw new ApiError(401, '인증이 필요합니다.')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = body?.error ?? `요청에 실패했습니다. (${res.status})`
    throw new ApiError(res.status, message)
  }

  // 204 No Content
  if (res.status === 204) return undefined as T

  const json: ApiResponse<T> = await res.json()

  if (!json.success) {
    throw new ApiError(res.status, json.error ?? '알 수 없는 오류가 발생했습니다.')
  }

  return json.data
}

/** 백엔드가 배열 또는 PageResponse 어느 형태로 오더라도 배열로 추출 */
export function extractList<T>(r: T[] | { content: T[] }): T[] {
  if (Array.isArray(r)) return r
  return r?.content ?? []
}

export const api = {
  get<T>(path: string): Promise<T> {
    return apiRequest<T>(path, { method: 'GET' })
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return apiRequest<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return apiRequest<T>(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  },

  patch<T>(path: string, body?: unknown): Promise<T> {
    return apiRequest<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  },

  delete<T>(path: string): Promise<T> {
    return apiRequest<T>(path, { method: 'DELETE' })
  },
}
