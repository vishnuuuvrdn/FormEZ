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
} = require("../controllers/documentController");

router.get("/", getAllDocuments);
router.get("/admin", getAllAdminDocuments);
router.get("/:docId", getDocumentById);
router.get("/category/:cat", getDocumentsByCategory);
router.post("/", createDocument);
router.put("/:docId", updateDocument);
router.patch("/:docId/toggle", toggleActiveStatus);
router.delete("/:docId", deleteDocument);

module.exports = router;
