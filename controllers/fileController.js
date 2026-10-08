const mongoose = require('mongoose');
const { Readable } = require('node:stream');
const { getBucket } = require('../config/db');

function parseFileId(id, res) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid file ID' });
    return null;
  }
  return new mongoose.Types.ObjectId(id);
}

async function uploadFile(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'Choose a file to upload' });
  }

  const bucket = getBucket();
  const uploadStream = bucket.openUploadStream(req.file.originalname, {
    contentType: req.file.mimetype,
    metadata: { uploadedBy: req.user.id },
  });

  await new Promise((resolve, reject) => {
    Readable.from(req.file.buffer)
      .pipe(uploadStream)
      .on('finish', resolve)
      .on('error', reject);
  });

  return res.status(201).json({
    id: uploadStream.id,
    filename: uploadStream.filename,
    contentType: req.file.mimetype,
    size: req.file.size,
  });
}

async function downloadFile(req, res, next) {
  const id = parseFileId(req.params.id, res);
  if (!id) return;

  const bucket = getBucket();
  const [file] = await bucket.find({ _id: id }).limit(1).toArray();
  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }

  res.set('Content-Type', file.contentType || 'application/octet-stream');
  res.set('Content-Disposition', `attachment; filename="${encodeURIComponent(file.filename)}"`);

  const downloadStream = bucket.openDownloadStream(id);
  downloadStream.on('error', next);
  downloadStream.pipe(res);
}

async function deleteFile(req, res) {
  const id = parseFileId(req.params.id, res);
  if (!id) return;

  const bucket = getBucket();
  const [file] = await bucket.find({ _id: id }).limit(1).toArray();
  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }
  if (String(file.metadata?.uploadedBy) !== req.user.id) {
    return res.status(403).json({ message: 'You cannot delete this file' });
  }

  await bucket.delete(id);
  return res.status(204).end();
}

module.exports = { uploadFile, downloadFile, deleteFile };