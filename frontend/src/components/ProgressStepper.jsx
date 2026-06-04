const steps = ["Requirements Check", "Official Links", "Step-by-Step Guide"];

export default function ProgressStepper({ currentStep }) {
  return (
    <div className="flex items-center justify-between mb-10 select-none">
      {steps.map((step, index) => {
        const isCompleted = currentStep > index;
        const isActive = currentStep === index;
        
        return (
          <div key={step} className="flex-1 flex flex-col items-center relative group">
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-[50%] right-[-50%] h-[2px] -z-10 transition-colors duration-300
                  ${currentStep > index ? "bg-accent" : "bg-border"}
                `}
              />
            )}

            {/* Stepper bubble */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300
                ${
                  isCompleted
                    ? "bg-accent text-white dark:text-bg border-accent shadow-sm"
                    : isActive
                    ? "bg-surface text-accent border-accent shadow-md ring-4 ring-accent/10"
                    : "bg-surface-muted text-text-secondary border-border"
                }
              `}
            >
              {index + 1}
            </div>

            <p
              className={`mt-3 text-[11px] font-bold uppercase tracking-wider text-center transition-colors duration-300
                ${isActive ? "text-accent" : isCompleted ? "text-text-primary" : "text-text-secondary"}
              `}
            >
              {step}
            </p>
          </div>
        );
      })}
    </div>
  );
}
