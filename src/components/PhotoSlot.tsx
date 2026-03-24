'use client'

import { useState, useRef, useCallback } from 'react'

type PhotoSlotProps = {
  slotId: string
  unitId: string
  label: string
  existingPhotoUrl?: string
  existingPhotoId?: string
}

type SlotState = 'empty' | 'uploading' | 'filled'

function resizeImage(file: File, maxWidth: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxWidth / img.width)
      const width = Math.round(img.width * scale)
      const height = Math.round(img.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context unavailable'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)

      // Try WebP first, fallback to JPEG
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            canvas.toBlob(
              (jpegBlob) => {
                if (jpegBlob) resolve(jpegBlob)
                else reject(new Error('画像の変換に失敗しました'))
              },
              'image/jpeg',
              0.85,
            )
          }
        },
        'image/webp',
        0.85,
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('画像の読み込みに失敗しました'))
    }
    img.src = url
  })
}

export function PhotoSlot({
  slotId,
  unitId,
  label,
  existingPhotoUrl,
  existingPhotoId,
}: PhotoSlotProps) {
  const [state, setState] = useState<SlotState>(
    existingPhotoUrl ? 'filled' : 'empty',
  )
  const [imageUrl, setImageUrl] = useState<string | undefined>(existingPhotoUrl)
  const [photoId, setPhotoId] = useState<string | undefined>(existingPhotoId)
  const [error, setError] = useState<string | null>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setError(null)
      setState('uploading')

      try {
        // Resize image
        const resizedBlob = await resizeImage(file, 1200)

        // Get presigned upload URL
        const res = await fetch('/api/photos/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ unitId, slotId }),
        })

        if (!res.ok) {
          const text = await res.text()
          let msg = 'アップロードURLの取得に失敗しました'
          try { msg = JSON.parse(text).error ?? msg } catch {}
          throw new Error(msg)
        }

        const { uploadUrl, photoId: newPhotoId } = await res.json()

        // Upload to S3 via presigned URL
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'image/webp' },
          body: resizedBlob,
        })

        if (!uploadRes.ok) {
          throw new Error('S3へのアップロードに失敗しました')
        }

        // Show the uploaded image locally
        const localUrl = URL.createObjectURL(resizedBlob)
        setImageUrl(localUrl)
        setPhotoId(newPhotoId)
        setState('filled')
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'アップロードに失敗しました',
        )
        setState('empty')
      }

      // Reset file inputs
      if (cameraInputRef.current) {
        cameraInputRef.current.value = ''
      }
      if (galleryInputRef.current) {
        galleryInputRef.current.value = ''
      }
    },
    [unitId, slotId],
  )

  const handleDelete = useCallback(async () => {
    if (!photoId) return

    try {
      const res = await fetch(`/api/photos/${photoId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? '削除に失敗しました')
      }

      setImageUrl(undefined)
      setPhotoId(undefined)
      setState('empty')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました')
    }
  }, [photoId])

  return (
    <div className="relative">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-sm">📸</span>
        <p className="text-xs font-bold text-emerald-700">{label}</p>
      </div>

      {state === 'empty' && (
        <div className="flex gap-2 w-full">
          <label className="flex-1 flex flex-col items-center justify-center h-36 border-2 border-dashed border-emerald-400 bg-emerald-50 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-100 transition-colors">
            <svg
              className="w-9 h-9 text-emerald-500 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-xs font-medium text-emerald-600">カメラで撮影</span>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
          <label className="flex-1 flex flex-col items-center justify-center h-36 border-2 border-dashed border-emerald-400 bg-emerald-50 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-100 transition-colors">
            <svg
              className="w-9 h-9 text-emerald-500 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs font-medium text-emerald-600">写真から選択</span>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </div>
      )}

      {state === 'uploading' && (
        <div className="flex items-center justify-center w-full h-32 border-2 border-emerald-300 rounded-xl bg-emerald-50">
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-emerald-700">アップロード中...</span>
          </div>
        </div>
      )}

      {state === 'filled' && imageUrl && (
        <div className="relative w-full rounded-xl overflow-hidden border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={label}
            className="w-full h-auto"
          />
          <button
            onClick={handleDelete}
            className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center text-xs hover:bg-black/80 transition-colors"
            aria-label="写真を削除"
          >
            &times;
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
