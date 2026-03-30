"use client"

import { useEffect, useRef, useState } from "react"

export default function Reveal({ children }: any) {

  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      },
      { threshold: 0.15 }
    )

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()

  }, [])

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-12"}
      `}
    >
      {children}
    </div>
  )

}