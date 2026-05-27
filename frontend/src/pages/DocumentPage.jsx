import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import api from "../api/axios";
import NavBar from "../components/NavBar";
import ProgressStepper from "../components/ProgressStepper";
import SuccessModal from "../components/SuccessModal";

export default function DocumentPage() {
  const { docId } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await api.get(`/documents/${docId}`);
        setDocument(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [docId]);

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
    else setShowModal(true);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-3xl mx-auto px-4 py-16 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-100 rounded-full w-1/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded-full w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-2xl mb-4">
            <FileText size={24} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Document not found
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            The document you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {document.info.title}
          </h1>
          <p className="text-gray-500 mt-2 text-[15px] leading-relaxed">
            {document.info.description}
          </p>
        </div>

        <ProgressStepper currentStep={currentStep} />

        <div className="mt-8 space-y-3">
          {/* STEP 1 — Requirements */}
          {currentStep === 0 &&
            document.requirements.map((req) => (
              <div
                key={req.order}
                className="bg-white border border-gray-100 rounded-2xl p-5 flex gap-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200"
              >
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm mt-0.5">
                  {req.order}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800 text-[15px]">
                    {req.name}
                  </h2>
                  <p className="mt-1 text-gray-500 text-sm leading-relaxed">
                    {req.description}
                  </p>
                </div>
              </div>
            ))}

          {/* STEP 2 — External Links */}
          {currentStep === 1 &&
            document.externalLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="group bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <LinkIcon size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800 text-[15px]">
                      {link.label}
                    </h2>
                    <p className="text-blue-500 text-xs mt-0.5 truncate max-w-xs">
                      {link.url}
                    </p>
                  </div>
                </div>
                <ExternalLink
                  size={16}
                  className="text-gray-300 group-hover:text-blue-500 transition-colors shrink-0"
                />
              </a>
            ))}

          {/* STEP 3 — Apply Steps */}
          {currentStep === 2 &&
            document.applySteps.map((step, i) => (
              <div
                key={step.stepNumber}
                className="bg-white border border-gray-100 rounded-2xl p-5 flex gap-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {step.stepNumber}
                  </div>
                  {i < document.applySteps.length - 1 && (
                    <div className="w-px flex-1 bg-gray-100 min-h-[20px]" />
                  )}
                </div>
                <div className="pb-2">
                  <h2 className="font-semibold text-gray-800 text-[15px]">
                    {step.title}
                  </h2>
                  <p className="mt-1 text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* Nav Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            <ArrowLeft size={15} />
            Previous
          </button>

          <button
            onClick={nextStep}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-150 shadow-sm shadow-blue-200"
          >
            {currentStep === 2 ? (
              <>
                <CheckCircle2 size={15} />
                Finish
              </>
            ) : (
              <>
                Next
                <ChevronRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>

      {showModal && (
        <SuccessModal document={document} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
