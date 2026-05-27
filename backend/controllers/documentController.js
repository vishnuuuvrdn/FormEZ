const Document = require("../models/Document");

// Get all active documents (for home page cards)
const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ isActive: true }).select(
      "docId category icon info isActive"
    );
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all documents regardless of isActive (for admin dashboard table)
const getAllAdminDocuments = async (req, res) => {
  try {
    const documents = await Document.find().select(
      "docId category icon info isActive"
    );
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one full document by docId
const getDocumentById = async (req, res) => {
  try {
    const { docId } = req.params;
    const document = await Document.findOne({ docId });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get documents by category
const getDocumentsByCategory = async (req, res) => {
  try {
    const { cat } = req.params;
    const documents = await Document.find({ 
      category: cat.toLowerCase(), 
      isActive: true 
    }).select("docId category icon info isActive");
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new document
const createDocument = async (req, res) => {
  try {
    const existingDoc = await Document.findOne({ docId: req.body.docId });
    if (existingDoc) {
      return res.status(400).json({ message: `Document with ID '${req.body.docId}' already exists.` });
    }

    const document = new Document(req.body);
    await document.save();
    res.status(201).json({ message: "Document created successfully", document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a document
const updateDocument = async (req, res) => {
  try {
    const { docId } = req.params;
    const document = await Document.findOneAndUpdate(
      { docId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json({ message: "Document updated successfully", document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle active status (Patch)
const toggleActiveStatus = async (req, res) => {
  try {
    const { docId } = req.params;
    const document = await Document.findOne({ docId });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.isActive = !document.isActive;
    await document.save();

    res.status(200).json({ 
      message: `Document status toggled successfully to ${document.isActive ? "Active" : "Inactive"}`, 
      isActive: document.isActive 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a document
const deleteDocument = async (req, res) => {
  try {
    const { docId } = req.params;
    const document = await Document.findOneAndDelete({ docId });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Search documents
const searchDocuments = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const documents = await Document.find({
      isActive: true,
      $or: [
        {
          "info.title": {
            $regex: query,
            $options: "i",
          },
        },
        {
          "info.description": {
            $regex: query,
            $options: "i",
          },
        },
        {
          category: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    }).select("docId category icon info");

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Related documents
const getRelatedDocuments = async (req, res) => {
  try {
    const { docId } = req.params;

    // Find current document
    const currentDocument = await Document.findOne({
      docId,
      isActive: true,
    });

    if (!currentDocument) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Find related docs from same category
    const relatedDocuments = await Document.find({
      category: currentDocument.category,
      docId: { $ne: docId },
      isActive: true,
    }).select("docId category icon info");

    res.status(200).json({
      success: true,
      count: relatedDocuments.length,
      data: relatedDocuments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getAllDocuments,
  getAllAdminDocuments,
  getDocumentById,
  getDocumentsByCategory,
  createDocument,
  updateDocument,
  toggleActiveStatus,
  deleteDocument,
  searchDocuments,
  getRelatedDocuments,
};
