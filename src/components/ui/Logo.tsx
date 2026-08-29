// Original mark: a single continuous line depicting a practitioner giving a massage to a
// reclined client, rendered in the site's gold gradient. Pairs with the serif wordmark.
interface LogoProps {
  className?: string;
  gradientId?: string;
}

export default function LogoMark({ className = 'w-10 h-10', gradientId = 'sakina-logo-gradient' }: LogoProps) {
  return (
    <svg viewBox="0 0 260 230" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a6d3b" />
          <stop offset="50%" stopColor="#e8cd8e" />
          <stop offset="100%" stopColor="#b8925a" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${gradientId})`} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        {/* practitioner head */}
        <path d="M170 30 C 158 30, 148 40, 148 53 C 148 66, 158 76, 170 76 C 182 76, 192 66, 192 53" />
        {/* practitioner torso/back */}
        <path d="M150 76 C 140 95, 128 108, 118 128 C 145 118, 165 122, 185 132 C 200 139, 212 148, 224 150" />
        <path d="M150 76 C 158 92, 160 108, 155 125" />
        {/* practitioner arms reaching down */}
        <path d="M118 128 C 112 138, 108 148, 112 158" />
        <path d="M128 122 C 124 133, 122 143, 127 152" />
        {/* client head, lying */}
        <path d="M35 158 C 24 155, 16 145, 18 133 C 20 121, 32 114, 44 118 C 56 122, 62 134, 58 145" />
        {/* client body reclined */}
        <path d="M40 155 C 60 148, 80 152, 100 158 C 130 167, 160 168, 190 160 C 205 156, 218 158, 230 165" />
        <path d="M35 165 C 25 172, 20 180, 26 188 C 32 195, 44 194, 50 186" />
      </g>
    </svg>
  );
}
