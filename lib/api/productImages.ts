import { api } from './client'
import type {
  PresignedUrlRequest,
  PresignedUrlResponse,
  ProductImageResponse,
  ProductImageSaveRequest,
} from '@/types/api'

export function getPresignedUrl(
  productId: number,
  body: PresignedUrlRequest,
): Promise<PresignedUrlResponse> {
  return api.post<PresignedUrlResponse>(`/products/${productId}/images/presigned`, body)
}

export async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  const res = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })
  if (!res.ok) throw new Error('이미지 업로드에 실패했습니다.')
}

export function saveImageUrl(
  productId: number,
  body: ProductImageSaveRequest,
): Promise<ProductImageResponse> {
  return api.post<ProductImageResponse>(`/products/${productId}/images`, body)
}

export function deleteImage(productId: number, imageId: number): Promise<void> {
  return api.delete<void>(`/products/${productId}/images/${imageId}`)
}

function isMockUrl(url: string): boolean {
  return url.includes('localhost') || url.includes('mock-upload')
}

export async function uploadProductImage(
  productId: number,
  file: File,
  displayOrder: number,
): Promise<ProductImageResponse> {
  const { presignedUrl, s3Key } = await getPresignedUrl(productId, {
    filename: file.name,
    contentType: file.type,
  })

  if (!isMockUrl(presignedUrl)) {
    await uploadToS3(presignedUrl, file)
  }

  return saveImageUrl(productId, { s3Key, displayOrder })
}
