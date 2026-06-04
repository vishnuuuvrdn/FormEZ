import {
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  CreditCard,
  CheckSquare,
} from "lucide-react";

export default function SuccessModal({ document, onClose }) {
  const { info, externalLinks, applySteps } = document;

  const officialLink = externalLinks?.find((l) => l.type === "official") || externalLinks?.[0];
  const lastStepTip = applySteps?.[applySteps.length - 1]?.tip;

  return (
    <div className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4 animate-fade-in">
      <div className="bg-surface rounded-t-2xl md:rounded-2xl w-full md:max-w-md shadow-2xl overflow-hidden relative max-h-[95vh] flex flex-col border border-border">
        {/* Top success banner - using the success HSL theme from the design palette */}
        <div className="bg-[#EDF6EF] dark:bg-[#152319] px-8 pt-8 pb-10 text-center relative border-b border-success/20 dark:border-success/10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors cursor-pointer p-2 rounded-full hover:bg-surface-muted"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
          
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#3A7D44]/10 dark:bg-[#469653]/15 rounded-full mb-4 border border-[#3A7D44]/20 dark:border-[#469653]/25 select-none">
            <CheckCircle2 size={30} className="text-[#3A7D44] dark:text-[#6BCB81]" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#256030] dark:text-[#6BCB81]">Guide Completed!</h2>
          <p className="text-text-secondary text-sm mt-1 leading-relaxed">
            You are fully prepared to apply for your{" "}
            <span className="font-bold text-text-primary">{info.title}</span>
          </p>
        </div>

        {/* Scallop edge design effect mapped in HSL success variables */}
        <div className="flex shrink-0">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="flex-1 h-2 bg-[#EDF6EF] dark:bg-[#152319] rounded-b-full border-t border-success/10 -mt-[1px]"
            />
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="px-6 py-6 space-y-5 overflow-y-auto max-h-[50vh]">
          {/* Dynamic details checklist */}
          <div>
            <p className="text-[10px] font-bold tracking-widest text-text-secondary uppercase mb-4 select-none">
              Application Summary
            </p>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-surface-muted border border-border flex items-center justify-center mt-0.5">
                  <CheckSquare size={14} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Follow all requirements
                  </p>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    Make sure you have gathered all {document.requirements?.length || 0} required documents as detailed in step 1 before proceeding.
                  </p>
                </div>
              </div>

              {info.fees && (
                <div className="flex gap-3 items-start">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-surface-muted border border-border flex items-center justify-center mt-0.5">
                    <CreditCard size={14} className="text-[#3A7D44] dark:text-[#6BCB81]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-text-primary">
                      Estimated Application Fees
                    </p>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      Costs are typically <span className="font-bold text-[#256030] dark:text-[#6BCB81]">{info.fees}</span>. Check the official portal for fee exemptions.
                    </p>
                  </div>
                </div>
              )}

              {info.processingTime && (
                <div className="flex gap-3 items-start">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-surface-muted border border-border flex items-center justify-center mt-0.5">
                    <Clock size={14} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-text-primary">
                      Estimated Processing Time
                    </p>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      Expect average processing times of <span className="font-bold text-text-primary">{info.processingTime}</span> after submit.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Final Tip */}
          {lastStepTip && (
            <div className="bg-surface-muted border border-border rounded-xl px-4 py-3">
              <p className="text-xs text-text-secondary leading-relaxed">
                <span className="font-bold text-accent">Final Pro-Tip: </span>
                {lastStepTip}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions Panel */}
        <div className="px-6 pb-6 pt-3 border-t border-border bg-bg/40 dark:bg-surface-muted/20 shrink-0 flex gap-3">
          {officialLink && (
            <a
              href={officialLink.url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-accent border border-border bg-surface hover:bg-surface-muted hover:border-accent transition-all duration-150 min-h-[44px]"
            >
              Portal Link
              <ExternalLink size={12} />
            </a>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-text-primary hover:bg-opacity-90 active:scale-95 transition-all duration-150 cursor-pointer min-h-[44px]"
          >
            Finished
          </button>
        </div>
      </div>
    </div>
  );
}
