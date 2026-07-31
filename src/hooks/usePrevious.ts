import { useEffect, useRef } from 'react'

function usePrevious<T>(value: T): T | undefined {
  const previousValueRef = useRef<T | undefined>(undefined)

  useEffect(() => {
    previousValueRef.current = value
  }, [value])

  return previousValueRef.current
}

export default usePrevious