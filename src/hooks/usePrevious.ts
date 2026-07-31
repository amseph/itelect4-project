import { useEffect, useRef, useState } from 'react'

function usePrevious<T>(value: T): T | undefined {
  const currentValueRef = useRef<T>(value)
  const [previousValue, setPreviousValue] = useState<T | undefined>(undefined)

  useEffect(() => {
    setPreviousValue(currentValueRef.current)
    currentValueRef.current = value
  }, [value])

  return previousValue
}

export default usePrevious