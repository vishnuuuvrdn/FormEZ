import {
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  Download,
  Bell,
} from "lucide-react";

export default function SuccessModal({ document, onClose }){
  const { info, externalLinks, applySteps } = document;

  const officialLink = externalLinks?.find((l) => l.type === "official");
  const lastStepTip = applySteps?.[applySteps.length - 1]?.tip;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Top banner */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-8 pt-8 pb-10 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-4">
            <CheckCircle2 size={30} className="text-white" strokeWidth={2} />
          </div>
          <h2 className="text-xl font-bold text-white">Guide Completed!</h2>
          <p className="text-green-100 text-sm mt-1">
            You're all set to apply for your{" "}
            <span className="font-semibold text-white">{info.title}</span>
          </p>
        </div>

        {/* Scallop edge */}
        <div className="flex">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="flex-1 h-3 bg-green-500 rounded-b-full -mt-1"
            />
          ))}
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* What happens next */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              What happens next
            </p>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mt-0.5">
                  <Download size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Save your Acknowledgment Slip
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Keep your 14-digit Enrollment ID (EID) safe — you'll need it
                    to track your application and download e-Aadhaar.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center mt-0.5">
                  <Clock size={14} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Wait up to 90 days
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Your Aadhaar is typically generated within 30–90 days of
                    enrolment. You can check the status online anytime using
                    your EID.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mt-0.5">
                  <Bell size={14} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    You'll receive an SMS
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    UIDAI will send an SMS to your registered mobile number once
                    your Aadhaar is generated and ready to download.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tip from last step */}
          {lastStepTip && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <p className="text-xs text-blue-700 leading-relaxed">
                <span className="font-semibold">Tip: </span>
                {lastStepTip}
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-6 flex gap-3">
          {officialLink && (
            <a
              href={officialLink.url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors duration-150"
            >
              Track Status
              <ExternalLink size={13} />
            </a>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 active:scale-95 transition-all duration-150"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

