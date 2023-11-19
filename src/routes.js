const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const fsextra = require('fs-extra');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.FOLDER);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  }
});

const upload = multer({ storage: storage }).single('file');

router.post('/files', upload, (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: 'No files found' });
  }

  const privateKey = 'testPrivateKey'
  const publicKey = 'testPublicKey' 

  return res.status(201).json({ 
    publicKey: publicKey, 
    privateKey: privateKey 
  });
});

router.get('/files/:publicKey', (req, res) => {
  const publicKey = req.params.publicKey;
  const path = process.env.FOLDER;

  if (!publicKey) {
    return res.status(400).json({ message: 'No public key found. Unable to download files' });
  }

  res.download(path + "/test-upload.jpg", function (err) {
    if (err) {
      if (err.status == 404) {
        console.log(err);
        return res.status(404).json({ message: 'No files present' });
      }
    }
  })

  // return res.status(200).json({ message: 'Files downloaded' });
});

router.delete('/files/:privateKey', (req, res) => {
  const privateKey = req.params.privateKey;
  const path = process.env.FOLDER;

  if (!privateKey) {
    return res.status(400).json({ message: 'No private key found. Unable to delete files' });
  }

  fsextra.remove(path + "/test-upload.jpg");

  return res.status(200).json({ message: 'Files deleted' });
});

module.exports = router;