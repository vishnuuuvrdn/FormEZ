const Document = require("../models/Document");

// Get all documents (for home page cards)
const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ isActive: true }).select(
      "docId category icon info",
    );
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one full document by docId
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({ docId: req.params.docId });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new document
const createDocument = async (req, res) => {
  try {
    const document = new Document(req.body);
    await document.save();
    res
      .status(201)
      .json({ message: "Document created successfully", document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a document
const updateDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndUpdate(
      { docId: req.params.docId },
      req.body,
      { new: true },
    );
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res
      .status(200)
      .json({ message: "Document updated successfully", document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a document
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      docId: req.params.docId,
    });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
