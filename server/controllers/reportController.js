const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function computeFileSha256(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('error', reject);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

module.exports.uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadedFilePath = path.resolve(req.file.path);
    const reportHash = await computeFileSha256(uploadedFilePath);

    return res.json({
      fileName: req.file.filename,
      reportHash,
      uploadedAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process file', details: err.message });
  }
};


