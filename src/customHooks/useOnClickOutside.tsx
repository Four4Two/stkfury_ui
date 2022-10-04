import { useEffect, useRef } from "react";

export const useOnClickOutside = (callback:() => void, initialValue = null) => {
  const elementRef = useRef<HTMLDivElement>(initialValue)
  useEffect(() => {
    function handler(event:MouseEvent | TouchEvent) {
      if (elementRef.current && !elementRef.current.contains(event.target as Node)) {
        callback()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => {
      document.removeEventListener("mousedown", handler)
    }
  }, [callback])
  return elementRef
}

