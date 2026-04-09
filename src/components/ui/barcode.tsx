import { cn } from "../../lib/utils"

export function Barcode({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-end gap-[1px] h-8", className)}>
      {[2, 4, 1, 3, 2, 5, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3].map((h, i) => (
        <div
          key={i}
          className="bg-foreground"
          style={{
            width: h % 2 === 0 ? "2px" : "1px",
            height: `${40 + h * 10}%`,
            opacity: 0.3 + (h / 10),
          }}
        />
      ))}
    </div>
  )
}
