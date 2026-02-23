import { cn } from "@/lib/utils";

const Logo = ({ className, withText = false }: { className?: string, withText?: boolean }) => {
  return (
    <div className={cn("flex items-center gap-2", withText ? "" : "justify-center")}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100" 
        className={cn("text-primary", className)}
        fill="currentColor"
      >
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4ade80' }} />
            <stop offset="100%" style={{ stopColor: '#0ea5e9' }} />
          </linearGradient>
          <linearGradient id="leaf-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#86efac' }} />
            <stop offset="100%" style={{ stopColor: '#22c55e' }} />
          </linearGradient>
        </defs>
        <path 
          d="M50,2.5 A47.5,47.5 0 1,0 97.5,50 47.5,47.5 0 0,0 50,2.5 Z M50,92.5 A42.5,42.5 0 1,1 92.5,50 42.5,42.5 0 0,1 50,92.5 Z" 
          fill="url(#ring-gradient)" 
        />
        <path 
          d="M48,85 C30,75 25,50 35,30 C45,10 65,15 70,35 C75,55 60,70 48,85 Z" 
          fill="url(#leaf-gradient)"
        />
        <path 
          d="M60,42 C62,32 75,30 80,38 C85,46 80,58 70,60 C60,62 58,52 60,42 Z" 
          fill="#34d399"
        />
        <path 
          d="M75,22.5 a7.5,7.5 0 0,1 0,15 a7.5,7.5 0 0,1 0,-15" 
          fill="#facc15" 
        />
        <path 
          d="M75,18 L75,15 M82.5,21.5 L85,20 M85,30 L87.5,30 M82.5,38.5 L85,40 M75,42 L75,45" 
          stroke="#facc15" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M50,95 C45,85 55,80 60,82 C70,85 75,95 70,100 C65,105 55,100 50,95 Z" 
          transform="translate(-5, -20)"
          fill="#2dd4bf"
        />
        <path 
          d="M65,75 a15,15 0 0,1 0,20 a25,30 0 0,0 0,-20"
           fill="#06b6d4"
        />
      </svg>
      {withText && (
        <span className="font-bold text-lg font-headline text-foreground">
          EcoSphere
        </span>
      )}
    </div>
  );
};

export default Logo;
