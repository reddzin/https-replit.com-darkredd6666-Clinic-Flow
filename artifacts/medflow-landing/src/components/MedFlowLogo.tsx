interface MedFlowLogoProps {
  iconOnly?: boolean;
  size?: number;
}

export function MedFlowLogo({ iconOnly = false, size = 36 }: MedFlowLogoProps) {
  return (
    <span className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="MedFlow icon"
      >
        <defs>
          <linearGradient
            id="medflow-grad"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#2d7a3a" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="20" fill="url(#medflow-grad)" />
        <path
          d="M4,20 L9,20 L12,11 L16,29 L19,20 L22,20 L25.5,25.5 L36,13"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {!iconOnly && (
        <span
          style={{
            fontWeight: 700,
            fontSize: "1.2rem",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          <span style={{ color: "#1a2e1a" }}>Med</span>
          <span style={{ color: "#2d7a3a" }}>Flow</span>
        </span>
      )}
    </span>
  );
}
