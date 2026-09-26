const tones = {
  deep: "lake-visual--deep",
  mist: "lake-visual--mist",
  warm: "lake-visual--warm",
} as const;

export function LakeVisual({
  tone = "deep",
  label,
  className = "",
}: {
  tone?: keyof typeof tones;
  label?: string;
  className?: string;
}) {
  return (
    <div className={`lake-visual ${tones[tone]} ${className}`} aria-hidden="true">
      <div className="lake-visual__sun" />
      <div className="lake-visual__ridge lake-visual__ridge--back" />
      <div className="lake-visual__ridge lake-visual__ridge--front" />
      <div className="lake-visual__water" />
      {label ? <span className="lake-visual__label">{label}</span> : null}
    </div>
  );
}
