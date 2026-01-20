import { cn } from '@/lib/utils';

interface MercorLogoProps {
  className?: string;
  size?: number;
}

export function MercorLogo({ className, size = 32 }: MercorLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <defs>
        <linearGradient
          id="mercor-gradient"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      {/* Stylized M shape - peaks pointing UP */}
      <path
        d="M6 12V32C6 34.2091 7.79086 36 10 36C12.2091 36 14 34.2091 14 32V23.4142L21.1716 33.6569C22.7337 35.7814 25.2663 35.7814 26.8284 33.6569L34 23.4142V32C34 34.2091 35.7909 36 38 36C40.2091 36 42 34.2091 42 32V12C42 9.79086 40.2091 8 38 8C36.4379 8 35.0662 8.86656 34.3944 10.1716L24 26L13.6056 10.1716C12.9338 8.86656 11.5621 8 10 8C7.79086 8 6 9.79086 6 12Z"
        fill="url(#mercor-gradient)"
      />
    </svg>
  );
}

export function MercorLogoMark({ className, size = 32 }: MercorLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <defs>
        <linearGradient
          id="mercor-mark-gradient"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* Rounded M shape - peaks pointing UP */}
      <path
        d="M6 12V32C6 34.2091 7.79086 36 10 36C12.2091 36 14 34.2091 14 32V23.4142L21.1716 33.6569C22.7337 35.7814 25.2663 35.7814 26.8284 33.6569L34 23.4142V32C34 34.2091 35.7909 36 38 36C40.2091 36 42 34.2091 42 32V12C42 9.79086 40.2091 8 38 8C36.4379 8 35.0662 8.86656 34.3944 10.1716L24 26L13.6056 10.1716C12.9338 8.86656 11.5621 8 10 8C7.79086 8 6 9.79086 6 12Z"
        fill="url(#mercor-mark-gradient)"
      />
    </svg>
  );
}

// Simple inline SVG for smaller use cases
export function MercorIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-6 w-6', className)}
    >
      <defs>
        <linearGradient
          id="mercor-icon-gradient"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* M shape - peaks pointing UP */}
      <path
        d="M3 6V16C3 17.1046 3.89543 18 5 18C6.10457 18 7 17.1046 7 16V12L10.5 16.5C11.1667 17.5 12.8333 17.5 13.5 16.5L17 12V16C17 17.1046 17.8954 18 19 18C20.1046 18 21 17.1046 21 16V6C21 4.89543 20.1046 4 19 4C18.2 4 17.5 4.43333 17.1 5.1L12 13L6.9 5.1C6.5 4.43333 5.8 4 5 4C3.89543 4 3 4.89543 3 6Z"
        fill="url(#mercor-icon-gradient)"
      />
    </svg>
  );
}
