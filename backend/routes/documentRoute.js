const express = require("express");
const router = express.Router();
const {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
} = require("../controllers/documentController");

router.get("/", getAllDocuments);
router.get("/:docId", getDocumentById);
router.post("/", createDocument);
router.put("/:docId", updateDocument);
router.delete("/:docId", deleteDocument);

module.exports = router;
