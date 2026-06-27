export function OnboardingStepper({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const progress = Math.min(Math.max(currentStep / totalSteps, 0), 1) * 100;

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-[#12101f]">
          Étape {currentStep} sur {totalSteps}
        </span>
        <span className="text-slate-500">{Math.round(progress)}%</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e5e2ff]">
        <div
          className="h-full rounded-full bg-[#6c63ff] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
