const { Schema, model } = require("mongoose");

const documentSchema = new Schema(
  {
    docId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["identity", "vehicle", "property", "education", "health", "other"],
    },
    icon: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    info: {
      title: { type: String, required: true },
      description: { type: String },
      tagline: { type: String },
      whoCanApply: { type: String },
      processingTime: { type: String },
      fees: { type: String },
    },
    requirements: [
      {
        order: { type: Number, required: true },
        name: { type: String, required: true },
        description: { type: String },
        examples: [{ type: String }],
        howToGet: { type: String },
        isOptional: { type: Boolean, default: false },
      },
    ],
    externalLinks: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
        type: {
          type: String,
          enum: ["official", "form", "helpline"],
          required: true,
        },
        description: { type: String },
      },
    ],
    applySteps: [
      {
        stepNumber: { type: Number, required: true },
        type: {
          type: String,
          enum: ["online", "offline", "both"],
          required: true,
        },
        title: { type: String, required: true },
        description: { type: String },
        tip: { type: String },
        warning: { type: String },
      },
    ],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Document = model("Document", documentSchema);
module.exports = Document;
