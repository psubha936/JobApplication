const express = require('express');
const router = express.Router();
const { showApplyJobPage, applyJob, getAppliedJobs,updateJobStatus } = require('../controllers/jobController');
const multer = require('multer');
const path = require('path');

const fs = require('fs');
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir); // Use the absolute path
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
const upload = multer({ storage });

// Show Apply Job Page
router.get('/apply', showApplyJobPage);

// Apply Job (with file upload)
router.post('/apply', upload.single('resume'), applyJob);

// Show Applied Jobs (with pagination)
router.get('/applied', getAppliedJobs);

router.post('/updateStatus',updateJobStatus)

module.exports = router;
