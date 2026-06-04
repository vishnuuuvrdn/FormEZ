import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Save, ArrowLeft, Plus, Trash2, HelpCircle, FileText, ChevronRight, AlertTriangle } from "lucide-react";
import * as documentService from "../services/documentService";
import { useToast } from "../utils/useToast";
import Input from "../components/Input";
import Button from "../components/Button";
import PageWrapper from "../components/PageWrapper";
import Badge from "../components/Badge";
import { ROUTES, CATEGORIES } from "../utils/constants";
import iconMap from "../utils/iconMap";

export const AdminDocumentFormPage = () => {
  const { docId } = useParams();
  const isEditMode = Boolean(docId);
  
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Form State structured exactly matching the Mongoose schema
  const [formData, setFormData] = useState({
    docId: "",
    category: "identity",
    icon: "IdCard",
    isActive: true,
    info: {
      title: "",
      description: "",
      tagline: "",
      whoCanApply: "",
      processingTime: "",
      fees: "",
    },
    requirements: [],
    externalLinks: [],
    applySteps: [],
    faqs: [],
  });

  useEffect(() => {
    if (!isEditMode) {
      // Generate a mock unique docId prefix in Create Mode
      const randomPrefix = Math.random().toString(36).substring(2, 6).toUpperCase();
      setFormData((prev) => ({
        ...prev,
        docId: `DOC-${randomPrefix}`,
      }));
      return;
    }

    const fetchDocumentData = async () => {
      setFetching(true);
      try {
        const response = await documentService.getById(docId);
        const doc = response.data;
        
        // Ensure arrays are initialized safely
        setFormData({
          docId: doc.docId || "",
          category: doc.category || "identity",
          icon: doc.icon || "IdCard",
          isActive: doc.isActive !== undefined ? doc.isActive : true,
          info: {
            title: doc.info?.title || "",
            description: doc.info?.description || "",
            tagline: doc.info?.tagline || "",
            whoCanApply: doc.info?.whoCanApply || "",
            processingTime: doc.info?.processingTime || "",
            fees: doc.info?.fees || "",
          },
          requirements: doc.requirements || [],
          externalLinks: doc.externalLinks || [],
          applySteps: doc.applySteps || [],
          faqs: doc.faqs || [],
        });
      } catch (err) {
        toast.error("Failed to load document records.");
        navigate(ROUTES.ADMIN_DASHBOARD);
      } finally {
        setFetching(false);
      }
    };

    fetchDocumentData();
  }, [docId, isEditMode, navigate]);

  // Input Change Handlers
  const handleBaseChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        [name]: value,
      },
    }));
  };

  // Array Manipulation Helpers - Requirements
  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [
        ...prev.requirements,
        {
          order: prev.requirements.length + 1,
          name: "",
          description: "",
          examples: [],
          howToGet: "",
          isOptional: false,
        },
      ],
    }));
  };

  const removeRequirement = (index) => {
    setFormData((prev) => {
      const updated = prev.requirements.filter((_, idx) => idx !== index);
      const reordered = updated.map((req, idx) => ({ ...req, order: idx + 1 }));
      return { ...prev, requirements: reordered };
    });
  };

  const handleRequirementChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.requirements];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, requirements: updated };
    });
  };

  const handleRequirementExamplesChange = (index, valueString) => {
    const examplesArray = valueString.split(",").map((s) => s.trim()).filter((s) => s);
    handleRequirementChange(index, "examples", examplesArray);
  };

  // Array Manipulation Helpers - External Links
  const addExternalLink = () => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: [
        ...prev.externalLinks,
        {
          label: "",
          url: "",
          type: "official",
          description: "",
        },
      ],
    }));
  };

  const removeExternalLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: prev.externalLinks.filter((_, idx) => idx !== index),
    }));
  };

  const handleExternalLinkChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.externalLinks];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, externalLinks: updated };
    });
  };

  // Array Manipulation Helpers - Apply Steps
  const addApplyStep = () => {
    setFormData((prev) => ({
      ...prev,
      applySteps: [
        ...prev.applySteps,
        {
          stepNumber: prev.applySteps.length + 1,
          type: "online",
          title: "",
          description: "",
          tip: "",
          warning: "",
        },
      ],
    }));
  };

  const removeApplyStep = (index) => {
    setFormData((prev) => {
      const updated = prev.applySteps.filter((_, idx) => idx !== index);
      const reindexed = updated.map((step, idx) => ({ ...step, stepNumber: idx + 1 }));
      return { ...prev, applySteps: reindexed };
    });
  };

  const handleApplyStepChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.applySteps];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, applySteps: updated };
    });
  };

  // Array Manipulation Helpers - FAQs
  const addFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          question: "",
          answer: "",
        },
      ],
    }));
  };

  const removeFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, idx) => idx !== index),
    }));
  };

  const handleFaqChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.faqs];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, faqs: updated };
    });
  };

  // Core Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.info.title || !formData.docId) {
      toast.error("Please fill in basic document details.");
      setActiveTab("info");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await documentService.update(docId, formData);
        toast.success("Document guidelines updated successfully.");
      } else {
        await documentService.create(formData);
        toast.success("New document guidelines registered successfully.");
      }
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to submit document guidelines.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "info", label: "Basic Info" },
    { id: "requirements", label: "Requirements" },
    { id: "links", label: "Official Links" },
    { id: "steps", label: "Filing Steps" },
    { id: "faqs", label: "FAQ Setup" },
  ];

  if (fetching) {
    return (
      <div className="bg-bg min-h-screen p-8 flex justify-center items-center">
        <div className="text-center space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-text-secondary select-none">
            Syncing document data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen">
      <PageWrapper>
        {/* Header Block */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex flex-col">
            <Link
              to={ROUTES.ADMIN_DASHBOARD}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-accent transition-colors mb-3 group select-none"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" /> Dashboard Panel
            </Link>
            <h1 className="text-3xl font-serif font-black text-text-primary leading-tight">
              {isEditMode ? "Edit Guide Builder" : "Create Guide Builder"}
            </h1>
          </div>

          <Badge variant="category" value={formData.category} />
        </div>

        {/* Tab Controls Navigation */}
        <div className="flex border-b border-border gap-2 overflow-x-auto pb-px mb-8 scrollbar-none select-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-200 shrink-0 cursor-pointer min-h-[44px]
                ${
                  activeTab === tab.id
                    ? "border-accent text-accent"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Core Form Sheet */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* TAB 1: Core basic Info */}
          {activeTab === "info" && (
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none pb-3 border-b border-border">
                Core Guideline Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Document Unique ID"
                  name="docId"
                  value={formData.docId}
                  onChange={handleBaseChange}
                  disabled={isEditMode}
                  helperText="Unique index. e.g. aadhaar-card. (Cannot be modified after creation)"
                  required
                />

                <Input
                  label="Guideline Title"
                  name="title"
                  value={formData.info.title}
                  onChange={handleInfoChange}
                  placeholder="e.g. Aadhaar Card Enrolment"
                  helperText="Primary display heading of the guide."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none">
                    Portal Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleBaseChange}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none">
                    Display Icon (Lucide React)
                  </label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleBaseChange}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                  >
                    {Object.keys(iconMap).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Tagline / Brief Subtitle"
                name="tagline"
                value={formData.info.tagline}
                onChange={handleInfoChange}
                placeholder="e.g. Get your 12-digit unique national identification number."
                helperText="Short secondary line shown in overview cards."
              />

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none">
                  Filing Description
                </label>
                <textarea
                  name="description"
                  value={formData.info.description}
                  onChange={handleInfoChange}
                  rows={4}
                  placeholder="Provide comprehensive background details regarding this guideline..."
                  className="w-full p-3.5 rounded-xl border border-border bg-surface text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                />
              </div>

              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none pt-4 pb-3 border-b border-border">
                Application Parameters
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Input
                  label="Eligibility (Who Can Apply)"
                  name="whoCanApply"
                  value={formData.info.whoCanApply}
                  onChange={handleInfoChange}
                  placeholder="e.g. All Indian residents"
                />
                
                <Input
                  label="Processing Timeframe"
                  name="processingTime"
                  value={formData.info.processingTime}
                  onChange={handleInfoChange}
                  placeholder="e.g. 30–90 days"
                />

                <Input
                  label="Estimated Fees"
                  name="fees"
                  value={formData.info.fees}
                  onChange={handleInfoChange}
                  placeholder="e.g. Free (enrolment) / ₹50 (updates)"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Requirements Checklist */}
          {activeTab === "requirements" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-border select-none">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Required Checklist Items ({formData.requirements.length})
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addRequirement}
                  className="min-h-[38px] cursor-pointer"
                >
                  <Plus size={14} className="mr-1.5" /> Add Requirement
                </Button>
              </div>

              {formData.requirements.length === 0 ? (
                <div className="bg-surface border border-border rounded-2xl p-10 text-center flex flex-col items-center justify-center">
                  <FileText size={22} className="text-text-secondary opacity-40 mb-2" />
                  <p className="text-sm font-semibold text-text-secondary">No checklist requirements declared.</p>
                  <Button variant="ghost" size="sm" onClick={addRequirement} className="mt-3 min-h-[38px] cursor-pointer">
                    Create First Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4 relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeRequirement(idx)}
                        className="absolute top-4 right-4 text-[#A62B2B] hover:bg-[#FBF1F1] dark:hover:bg-[#2C1515] p-2 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Remove requirement"
                      >
                        <Trash2 size={15} />
                      </button>

                      <div className="flex items-center gap-3">
                        <Badge variant="status" value="active" className="select-none">
                          Req #{req.order}
                        </Badge>
                        <div className="flex items-center gap-2 select-none">
                          <input
                            type="checkbox"
                            id={`req-opt-${idx}`}
                            checked={req.isOptional}
                            onChange={(e) => handleRequirementChange(idx, "isOptional", e.target.checked)}
                            className="w-4 h-4 rounded text-accent focus:ring-accent border-border"
                          />
                          <label htmlFor={`req-opt-${idx}`} className="text-xs font-bold uppercase tracking-wider text-text-secondary cursor-pointer">
                            Mark Optional
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Requirement Name"
                          value={req.name}
                          onChange={(e) => handleRequirementChange(idx, "name", e.target.value)}
                          placeholder="e.g. Proof of Identity (POI)"
                          required
                        />

                        <Input
                          label="Visual Examples (Comma Separated)"
                          value={req.examples?.join(", ")}
                          onChange={(e) => handleRequirementExamplesChange(idx, e.target.value)}
                          placeholder="e.g. Passport, PAN Card, Voter ID"
                          helperText="Helps users identify accepted formats."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Brief Description"
                          value={req.description}
                          onChange={(e) => handleRequirementChange(idx, "description", e.target.value)}
                          placeholder="Briefly describe what this checklist item represents..."
                        />

                        <Input
                          label="How To Retrieve (Instruction)"
                          value={req.howToGet}
                          onChange={(e) => handleRequirementChange(idx, "howToGet", e.target.value)}
                          placeholder="e.g. Apply online on NSDL site or visit nearest center."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Action portal Links */}
          {activeTab === "links" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-border select-none">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Verified Resource Portals ({formData.externalLinks.length})
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addExternalLink}
                  className="min-h-[38px] cursor-pointer"
                >
                  <Plus size={14} className="mr-1.5" /> Add Link
                </Button>
              </div>

              {formData.externalLinks.length === 0 ? (
                <div className="bg-surface border border-border rounded-2xl p-10 text-center flex flex-col items-center justify-center">
                  <HelpCircle size={22} className="text-text-secondary opacity-40 mb-2" />
                  <p className="text-sm font-semibold text-text-secondary">No portal resources declared.</p>
                  <Button variant="ghost" size="sm" onClick={addExternalLink} className="mt-3 min-h-[38px] cursor-pointer">
                    Create First Link
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.externalLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4 relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeExternalLink(idx)}
                        className="absolute top-4 right-4 text-[#A62B2B] hover:bg-[#FBF1F1] dark:hover:bg-[#2C1515] p-2 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Remove link"
                      >
                        <Trash2 size={15} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Link Label"
                          value={link.label}
                          onChange={(e) => handleExternalLinkChange(idx, "label", e.target.value)}
                          placeholder="e.g. UIDAI Official Portal"
                          required
                        />

                        <Input
                          label="Resource URL"
                          type="url"
                          value={link.url}
                          onChange={(e) => handleExternalLinkChange(idx, "url", e.target.value)}
                          placeholder="e.g. https://uidai.gov.in"
                          required
                        />

                        <div className="flex flex-col gap-1.5 w-full">
                          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none">
                            Resource Type
                          </label>
                          <select
                            value={link.type}
                            onChange={(e) => handleExternalLinkChange(idx, "type", e.target.value)}
                            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                          >
                            <option value="official">OFFICIAL WEB PORTAL</option>
                            <option value="form">DIRECT DOWNLOAD FORM</option>
                            <option value="helpline">SUPPORT HELPLINE</option>
                          </select>
                        </div>
                      </div>

                      <Input
                        label="Detailed Description"
                        value={link.description}
                        onChange={(e) => handleExternalLinkChange(idx, "description", e.target.value)}
                        placeholder="Provide details about what actions users can execute on this portal..."
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Apply Steps */}
          {activeTab === "steps" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-border select-none">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Filing Steps Workflow ({formData.applySteps.length})
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addApplyStep}
                  className="min-h-[38px] cursor-pointer"
                >
                  <Plus size={14} className="mr-1.5" /> Add Step
                </Button>
              </div>

              {formData.applySteps.length === 0 ? (
                <div className="bg-surface border border-border rounded-2xl p-10 text-center flex flex-col items-center justify-center">
                  <ChevronRight size={22} className="text-text-secondary opacity-40 mb-2" />
                  <p className="text-sm font-semibold text-text-secondary">No filing steps declared.</p>
                  <Button variant="ghost" size="sm" onClick={addApplyStep} className="mt-3 min-h-[38px] cursor-pointer">
                    Create First Step
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.applySteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4 relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeApplyStep(idx)}
                        className="absolute top-4 right-4 text-[#A62B2B] hover:bg-[#FBF1F1] dark:hover:bg-[#2C1515] p-2 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Remove step"
                      >
                        <Trash2 size={15} />
                      </button>

                      <div className="flex items-center gap-3">
                        <Badge variant="status" value="active" className="select-none">
                          Step #{step.stepNumber}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Step Title"
                          value={step.title}
                          onChange={(e) => handleApplyStepChange(idx, "title", e.target.value)}
                          placeholder="e.g. Locate nearest Enrolment Center"
                          required
                        />

                        <div className="flex flex-col gap-1.5 w-full">
                          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none">
                            Step Medium
                          </label>
                          <select
                            value={step.type}
                            onChange={(e) => handleApplyStepChange(idx, "type", e.target.value)}
                            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                          >
                            <option value="online">ONLINE SYSTEM PORTAL</option>
                            <option value="offline">OFFLINE SUBMIT OFFICE</option>
                            <option value="both">HYBRID FILING</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none">
                          Detailed Instructions
                        </label>
                        <textarea
                          value={step.description}
                          onChange={(e) => handleApplyStepChange(idx, "description", e.target.value)}
                          rows={3}
                          placeholder="Explain what visual prompts or fields the user should complete in this step..."
                          className="w-full p-3.5 rounded-xl border border-border bg-surface text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Helper Pro-Tip"
                          value={step.tip}
                          onChange={(e) => handleApplyStepChange(idx, "tip", e.target.value)}
                          placeholder="e.g. Keep EID acknowledgment slips safe."
                        />

                        <Input
                          label="Caution Warning Notification"
                          value={step.warning}
                          onChange={(e) => handleApplyStepChange(idx, "warning", e.target.value)}
                          placeholder="e.g. Avoid unverified helpline broker calls."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: FAQs */}
          {activeTab === "faqs" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-border select-none">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Frequently Asked Questions ({formData.faqs.length})
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addFaq}
                  className="min-h-[38px] cursor-pointer"
                >
                  <Plus size={14} className="mr-1.5" /> Add FAQ
                </Button>
              </div>

              {formData.faqs.length === 0 ? (
                <div className="bg-surface border border-border rounded-2xl p-10 text-center flex flex-col items-center justify-center">
                  <HelpCircle size={22} className="text-text-secondary opacity-40 mb-2" />
                  <p className="text-sm font-semibold text-text-secondary">No FAQs declared.</p>
                  <Button variant="ghost" size="sm" onClick={addFaq} className="mt-3 min-h-[38px] cursor-pointer">
                    Create First FAQ
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4 relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeFaq(idx)}
                        className="absolute top-4 right-4 text-[#A62B2B] hover:bg-[#FBF1F1] dark:hover:bg-[#2C1515] p-2 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Remove FAQ"
                      >
                        <Trash2 size={15} />
                      </button>

                      <Input
                        label="FAQ Question"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                        placeholder="e.g. Can I update my mobile number online?"
                        required
                      />

                      <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none">
                          FAQ Answer
                        </label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                          rows={3}
                          placeholder="Provide the comprehensive answer to this question..."
                          className="w-full p-3.5 rounded-xl border border-border bg-surface text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Form Actions Footer Panel */}
          <div className="flex items-center justify-between pt-6 border-t border-border select-none">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary cursor-pointer">
                Guide Active Status
              </label>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
                className="cursor-pointer focus:outline-none min-h-[38px]"
              >
                <Badge variant="status" value={formData.isActive ? "active" : "inactive"} />
              </button>
            </div>

            <div className="flex gap-3">
              <Link to={ROUTES.ADMIN_DASHBOARD}>
                <Button variant="secondary" size="md" className="min-h-[44px] cursor-pointer">
                  Cancel Changes
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                className="min-h-[44px] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Save size={15} /> {isEditMode ? "Save Guide" : "Register Guide"}
                </div>
              </Button>
            </div>
          </div>
        </form>
      </PageWrapper>
    </div>
  );
};

export default AdminDocumentFormPage;
