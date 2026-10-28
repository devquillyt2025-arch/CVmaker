/** The FolioX "FX" monogram. */
export default function FXMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.78)} viewBox="0 0 36 28" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="fxg" x1="0" y1="0" x2="36" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6C63FF" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <line x1="3" y1="3" x2="3" y2="25" stroke="url(#fxg)" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="3" y1="3" x2="14" y2="3" stroke="url(#fxg)" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="3" y1="14" x2="11" y2="14" stroke="url(#fxg)" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="19" y1="3" x2="33" y2="25" stroke="url(#fxg)" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="33" y1="3" x2="19" y2="25" stroke="url(#fxg)" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}
