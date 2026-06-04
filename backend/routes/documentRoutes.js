const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/documentController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllDocuments);
router.get("/admin", protect, getAllAdminDocuments);
router.get("/search", searchDocuments);
router.get("/:docId/related", getRelatedDocuments);
router.get("/:docId", getDocumentById);
router.get("/category/:cat", getDocumentsByCategory);
router.post("/", protect, createDocument);
router.put("/:docId", protect, updateDocument);
router.patch("/:docId/toggle", protect, toggleActiveStatus);
router.delete("/:docId", protect, deleteDocument);

module.exports = router;
