'use client'

import { useState, useRef, useEffect } from 'react'

type LectureSectionProps = {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function LectureSection({
  title,
  children,
  defaultOpen = false,
}: LectureSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    undefined,
  )

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [children, isOpen])

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-bold text-emerald-700">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        style={{
          maxHeight: isOpen ? contentHeight ?? 'none' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        className="transition-all duration-200 ease-in-out overflow-hidden"
      >
        <div ref={contentRef} className="px-4 pb-4 pt-2">
          {children}
        </div>
      </div>
    </div>
  )
}
