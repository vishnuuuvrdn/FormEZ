import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  Clock,
  CircleDollarSign,
  UserCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import * as documentService from "../services/documentService";
import NavBar from "../components/NavBar";
import ProgressStepper from "../components/ProgressStepper";
import SuccessModal from "../components/SuccessModal";
import Skeleton from "../components/Skeleton";
import Badge from "../components/Badge";

export default function DocumentPage() {
  const { docId } = useParams();
  const [document, setDocument] = useState(null);
  const [relatedDocs, setRelatedDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    const fetchDocumentData = async () => {
      setLoading(true);
      setError("");
      try {
        const docRes = await documentService.getById(docId);
        setDocument(docRes.data);

        // Fetch related documents in the same category
        try {
          const relatedRes = await documentService.getRelated(docId);
          setRelatedDocs(relatedRes.data?.data || []);
        } catch (relatedErr) {
          console.error("Failed to fetch related documents:", relatedErr);
        }
      } catch (err) {
        setError("Document not found or backend connection failed.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentData();
    setCurrentStep(0);
    setOpenFaqIndex(null);
  }, [docId]);

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
    else setShowModal(true);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <NavBar />
        <div className="max-w-6xl mx-auto px-5 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton width="w-1/4" height="h-4" />
            <Skeleton width="w-2/3" height="h-10" />
            <Skeleton width="w-full" height="h-6" />
            <Skeleton variant="rectangle" width="w-full" height="h-20" />
            <div className="space-y-4 pt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-surface border border-border rounded-2xl p-5 flex gap-4 animate-pulse">
                  <Skeleton variant="circle" width="w-8" height="h-8" />
                  <div className="flex-1 space-y-2">
                    <Skeleton width="w-1/3" height="h-4" />
                    <Skeleton width="w-2/3" height="h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
              <Skeleton width="w-1/3" height="h-4" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton variant="circle" width="w-6" height="h-6" />
                  <Skeleton width="w-1/2" height="h-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-bg">
        <NavBar />
        <div className="max-w-3xl mx-auto px-5 py-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-surface-muted rounded-2xl mb-4 border border-border">
            <FileText size={28} className="text-text-secondary" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-text-primary leading-tight">
            Document Guide Not Found
          </h2>
          <p className="text-text-secondary mt-2 text-sm leading-relaxed max-w-md mx-auto">
            The guideline document you are seeking doesn't exist, is inactive, or has been relocated by administrators.
          </p>
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-accent hover:bg-accent-hover transition-all duration-150"
            >
              <ArrowLeft size={14} /> Back to Search Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { info, requirements, externalLinks, applySteps, faqs } = document;

  return (
    <div className="min-h-screen bg-bg pb-20">
      <NavBar />

      <div className="max-w-6xl mx-auto px-5 py-10 md:py-16">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-accent transition-colors mb-6 group select-none"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Guides
        </Link>

        {/* Master Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main timeline core panel */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <Badge variant="category" value={document.category} />
                {!document.isActive && (
                  <span className="text-[10px] bg-danger/10 text-danger border border-danger/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
                    Inactive
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-black text-text-primary mt-3 leading-tight">
                {info.title}
              </h1>
              {info.tagline && (
                <p className="text-sm font-bold uppercase tracking-wider text-accent mt-2">
                  {info.tagline}
                </p>
              )}
              {info.description && (
                <p className="text-sm text-text-secondary leading-relaxed mt-3">
                  {info.description}
                </p>
              )}
            </div>

            {/* Progress Stepper Timeline bar */}
            <div className="pt-6 border-t border-border">
              <ProgressStepper currentStep={currentStep} />
            </div>

            {/* Core Step Details Panels */}
            <div className="space-y-4">
              {/* STEP 1: Requirements Check */}
              {currentStep === 0 && (
                <div className="space-y-3.5 animate-fade-in">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none mb-1">
                    Requirements Checklist
                  </h3>
                  {requirements && requirements.length > 0 ? (
                    requirements.map((req) => (
                      <div
                        key={req.order}
                        className="bg-surface border border-border rounded-2xl p-5 flex gap-4 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200"
                      >
                        <div className="shrink-0 w-8 h-8 rounded-xl bg-surface-muted flex items-center justify-center text-accent border border-border font-bold text-sm mt-0.5 select-none">
                          {req.order}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center justify-between gap-4">
                            <h4 className="font-bold text-text-primary text-sm leading-snug">
                              {req.name}
                            </h4>
                            {req.isOptional && (
                              <span className="text-[9px] bg-surface-muted text-text-secondary border border-border px-2 py-0.5 rounded-full font-bold uppercase tracking-widest select-none">
                                Optional
                              </span>
                            )}
                          </div>
                          
                          {req.description && (
                            <p className="text-xs text-text-secondary leading-relaxed">
                              {req.description}
                            </p>
                          )}
                          
                          {req.examples && req.examples.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <span className="text-[10px] text-text-secondary font-bold mr-1 uppercase tracking-wider">e.g.</span>
                              {req.examples.map((ex, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-surface-muted text-text-primary px-2 py-0.5 rounded-md font-medium border border-border"
                                >
                                  {ex}
                                </span>
                              ))}
                            </div>
                          )}

                          {req.howToGet && (
                            <div className="flex gap-1.5 items-start mt-2 bg-bg/50 dark:bg-surface-muted/35 border border-border p-3 rounded-xl text-xs text-text-secondary leading-relaxed">
                              <Lightbulb size={14} className="text-accent shrink-0 mt-0.5" />
                              <p>
                                <span className="font-bold text-text-primary">How to get: </span>
                                {req.howToGet}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-text-secondary">No requirements documented for this guide.</p>
                  )}
                </div>
              )}

              {/* STEP 2: Official Links */}
              {currentStep === 1 && (
                <div className="space-y-3.5 animate-fade-in">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none mb-1">
                    Verified Application Resources
                  </h3>
                  {externalLinks && externalLinks.length > 0 ? (
                    externalLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group bg-surface border border-border rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-accent/40 transition-all duration-200 min-h-[44px]"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="shrink-0 w-9 h-9 rounded-xl bg-surface-muted flex items-center justify-center border border-border group-hover:bg-accent/5 transition-colors">
                            <LinkIcon size={15} className="text-accent" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-text-primary text-sm leading-snug group-hover:text-accent transition-colors truncate">
                                {link.label}
                              </h4>
                              {link.type && (
                                <span className="text-[8px] bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest select-none">
                                  {link.type}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-accent/80 font-semibold truncate max-w-xs mt-0.5 leading-none">
                              {link.url}
                            </p>
                            {link.description && (
                              <p className="text-xs text-text-secondary mt-1.5 truncate max-w-md">
                                {link.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <ExternalLink
                          size={14}
                          className="text-text-secondary opacity-40 group-hover:opacity-100 group-hover:text-accent transition-all shrink-0 ml-2"
                        />
                      </a>
                    ))
                  ) : (
                    <p className="text-sm text-text-secondary">No links documented for this guide.</p>
                  )}
                </div>
              )}

              {/* STEP 3: Apply Steps */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none mb-1">
                    Application Filing Steps
                  </h3>
                  {applySteps && applySteps.length > 0 ? (
                    applySteps.map((step, i) => (
                      <div
                        key={step.stepNumber}
                        className="bg-surface border border-border rounded-2xl p-6 flex gap-4 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200 relative overflow-hidden"
                      >
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          <div className="w-8 h-8 rounded-full bg-accent text-white dark:text-bg font-bold text-sm flex items-center justify-center select-none shadow-sm shadow-accent/15">
                            {step.stepNumber}
                          </div>
                          {i < applySteps.length - 1 && (
                            <div className="w-px flex-1 bg-border min-h-[30px]" />
                          )}
                        </div>
                        <div className="space-y-2 flex-1 pb-2">
                          <div className="flex items-center justify-between gap-4">
                            <h4 className="font-bold text-text-primary text-sm leading-snug">
                              {step.title}
                            </h4>
                            {step.type && (
                              <span className="text-[9px] bg-surface-muted text-text-primary border border-border px-2 py-0.5 rounded-full font-bold uppercase tracking-widest select-none">
                                {step.type}
                              </span>
                            )}
                          </div>
                          
                          {step.description && (
                            <p className="text-xs text-text-secondary leading-relaxed">
                              {step.description}
                            </p>
                          )}

                          {step.tip && (
                            <div className="flex gap-2 items-start mt-3 bg-[#EDF6EF] dark:bg-[#152319] border border-[#D3EAD8] dark:border-[#223929] p-3.5 rounded-xl text-xs text-[#256030] dark:text-[#6BCB81] leading-relaxed">
                              <Lightbulb size={14} className="text-[#3A7D44] dark:text-[#6BCB81] shrink-0 mt-0.5 animate-pulse" />
                              <p>
                                <span className="font-bold">Tip: </span>
                                {step.tip}
                              </p>
                            </div>
                          )}

                          {step.warning && (
                            <div className="flex gap-2 items-start mt-3 bg-[#FBF1F1] dark:bg-[#2C1515] border border-[#F6D7D7] dark:border-[#4A2222] p-3.5 rounded-xl text-xs text-[#A62B2B] dark:text-[#E86D6D] leading-relaxed">
                              <AlertTriangle size={14} className="text-[#C0392B] dark:text-[#E86D6D] shrink-0 mt-0.5 animate-bounce" />
                              <p>
                                <span className="font-bold">Important: </span>
                                {step.warning}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-text-secondary">No filing instructions documented for this guide.</p>
                  )}
                </div>
              )}
            </div>

            {/* Stepper Buttons panel */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border select-none">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-text-secondary bg-surface border border-border hover:bg-surface-muted disabled:opacity-40 disabled:pointer-events-none transition-all duration-150 min-w-[120px] justify-center min-h-[44px] cursor-pointer"
              >
                <ArrowLeft size={13} /> Previous
              </button>

              <button
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-accent hover:bg-accent-hover active:scale-95 transition-all duration-150 shadow-sm shadow-accent/20 min-w-[120px] justify-center min-h-[44px] cursor-pointer"
              >
                {currentStep === 2 ? (
                  <>
                    <CheckCircle2 size={13} /> Finish Guide
                  </>
                ) : (
                  <>
                    Next Step <ChevronRight size={13} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Guidelines Sidebar Information Panel */}
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-5">
              <h3 className="font-serif font-bold text-lg text-text-primary pb-3 border-b border-border">
                Quick Guide Info
              </h3>
              
              <div className="space-y-4">
                {info.whoCanApply && (
                  <div className="flex gap-3">
                    <UserCheck size={16} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                        Who Can Apply
                      </p>
                      <p className="text-xs text-text-primary mt-0.5 leading-normal">
                        {info.whoCanApply}
                      </p>
                    </div>
                  </div>
                )}

                {info.fees && (
                  <div className="flex gap-3">
                    <CircleDollarSign size={16} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                        Filing Fees
                      </p>
                      <p className="text-xs text-text-primary mt-0.5 leading-normal">
                        {info.fees}
                      </p>
                    </div>
                  </div>
                )}

                {info.processingTime && (
                  <div className="flex gap-3">
                    <Clock size={16} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                        Processing Time
                      </p>
                      <p className="text-xs text-text-primary mt-0.5 leading-normal">
                        {info.processingTime}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic FAQs Section */}
            {faqs && faqs.length > 0 && (
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-lg text-text-primary pb-2 border-b border-border">
                  Frequently Asked
                </h3>
                
                <div className="divide-y divide-border bg-surface">
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="py-3 first:pt-0 last:pb-0">
                        <button
                          onClick={() => toggleFaq(idx)}
                          className="w-full flex items-center justify-between text-left gap-2 text-xs font-bold uppercase tracking-wider text-text-primary hover:text-accent transition-colors py-1 cursor-pointer font-sans"
                        >
                          <span>{faq.question}</span>
                          {isOpen ? (
                            <ChevronUp size={14} className="text-accent shrink-0" />
                          ) : (
                            <ChevronDown size={14} className="text-text-secondary shrink-0" />
                          )}
                        </button>
                        
                        {isOpen && (
                          <p className="text-xs text-text-secondary mt-2 leading-relaxed animate-fade-in">
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM RELATED GUIDES SECTION */}
        {relatedDocs && relatedDocs.length > 0 && (
          <div className="mt-16 pt-10 border-t border-border">
            <div className="max-w-2xl mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent select-none">
                Related Information
              </span>
              <h2 className="text-2xl font-serif font-bold text-text-primary leading-tight mt-1">
                Other guides in this category
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDocs.slice(0, 3).map((doc) => (
                <div
                  key={doc.docId}
                  className="bg-surface border border-border rounded-2xl p-5 hover:border-accent/40 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <Badge variant="category" value={doc.category} className="mb-3.5" />
                    <h4 className="font-serif font-bold text-text-primary text-base leading-tight">
                      {doc.info.title}
                    </h4>
                    <p className="text-xs text-text-secondary mt-2 line-clamp-2 leading-relaxed">
                      {doc.info.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <Link
                      to={`/document/${doc.docId}`}
                      className="text-xs font-bold uppercase tracking-wider text-accent hover:text-accent-hover flex items-center gap-1 transition-colors min-h-[44px]"
                    >
                      View Guide <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <SuccessModal document={document} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
