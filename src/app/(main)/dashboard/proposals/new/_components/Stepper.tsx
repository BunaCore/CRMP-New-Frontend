import { Check } from "lucide-react";

export const STEPS = [
  { title: "Draft", desc: "Basic details" },
  { title: "Team", desc: "Collaborators" },
  { title: "Budget", desc: "Funding specifics" },
  { title: "Review", desc: "Final submit" },
];

export function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="relative mx-auto mb-6 flex w-full max-w-2xl justify-between">
      <div className="-z-10 absolute top-[16px] right-[5%] left-[5%] h-[2px] bg-slate-100 dark:bg-slate-800" />
      <div
        className="-z-10 absolute top-[16px] left-[5%] h-[2px] bg-blue-600 transition-all duration-500 ease-in-out"
        style={{ width: `calc(${(currentStep / (STEPS.length - 1)) * 90}%)` }}
      />
      {STEPS.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        return (
          <div key={step.title} className="relative z-10 flex w-1/4 flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold text-[13px] transition-all ease-out ${
                isActive
                  ? "bg-blue-600 text-white ring-2 ring-blue-100 dark:ring-blue-900/50"
                  : isCompleted
                    ? "border-2 border-blue-600 bg-white text-blue-600 dark:border-blue-500 dark:bg-slate-950"
                    : "border border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-950"
              }`}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <div className="text-center">
              <p
                className={`font-bold text-[11px] uppercase tracking-wider ${
                  isActive
                    ? "text-blue-700 dark:text-blue-400"
                    : isCompleted
                      ? "text-slate-700 dark:text-slate-300"
                      : "text-slate-400"
                }`}
              >
                {step.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
