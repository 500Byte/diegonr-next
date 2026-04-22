import { useRef, useEffect, useState, useCallback } from "react"
import { cn } from "../../lib/utils"

interface TextScrambleProps {
  text: string
  className?: string
  scrambleOnHover?: boolean
  autoStart?: boolean
  delay?: number
  speed?: number
}

const CHARS = "!<>-_\\/[]{}—=+*^?#________"

export function TextScramble({
  text,
  className,
  scrambleOnHover = false,
  autoStart = true,
  delay = 0,
  speed = 30,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(autoStart ? "" : text)
  const [isScrambling, setIsScrambling] = useState(false)
  const frameRef = useRef(0)
  const resolveRef = useRef<(() => void) | null>(null)
  
  const scramble = useCallback(() => {
    return new Promise<void>((resolve) => {
      resolveRef.current = resolve
      setIsScrambling(true)
      
      let frame = 0
      const queue: Array<{
        from: string
        to: string
        start: number
        end: number
        char?: string
      }> = []
      
      // Create queue
      const oldText = displayText
      const length = Math.max(oldText.length, text.length)
      
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || ""
        const to = text[i] || ""
        const start = Math.floor(Math.random() * 40)
        const end = start + Math.floor(Math.random() * 40)
        queue.push({ from, to, start, end })
      }
      
      const update = () => {
        let output = ""
        let complete = 0
        
        for (let i = 0; i < queue.length; i++) {
          const item = queue[i]
          
          if (frame >= item.end) {
            complete++
            output += item.to
          } else if (frame >= item.start) {
            if (!item.char || Math.random() < 0.28) {
              item.char = CHARS[Math.floor(Math.random() * CHARS.length)]
            }
            output += item.char
          } else {
            output += item.from
          }
        }
        
        setDisplayText(output)
        
        if (complete === queue.length) {
          setIsScrambling(false)
          resolve()
        } else {
          frameRef.current = requestAnimationFrame(update)
          frame++
        }
      }
      
      update()
    })
  }, [displayText, text])
  
  useEffect(() => {
    if (autoStart && !isScrambling) {
      const timeout = setTimeout(() => {
        scramble()
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [autoStart, delay, scramble, isScrambling])
  
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])
  
  const handleMouseEnter = () => {
    if (scrambleOnHover && !isScrambling) {
      scramble()
    }
  }

  const handleFocus = () => {
    if (scrambleOnHover && !isScrambling) {
      scramble()
    }
  }

  return (
    <span
      className={cn("inline-block focus:outline-none focus:ring-1 focus:ring-white/30 focus:ring-offset-1 rounded-sm", className)}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      tabIndex={scrambleOnHover ? 0 : -1}
    >
      {displayText || text}
    </span>
  )
}
