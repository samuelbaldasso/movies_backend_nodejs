const fs = require('fs');
const path = require("path");

const recentUploads = [];

// Scan the /uploads directory and add image URLs to recentUploads
const uploadDirectory = path.join(__dirname, '../uploads');
fs.readdir(uploadDirectory, (err, files) => {
  if (err) {
    console.error('Error reading /uploads directory:', err);
    return;
  }
  files.forEach((file) => {
    const imageUrl = `http://localhost:3001/uploads/${file}`;
    recentUploads.push(imageUrl);
  });
  console.log('Initialized recentUploads with existing images:', recentUploads);
});

exports.postUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  }
  const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  recentUploads.push(imageUrl); // Save the image URL in our in-memory array
  res.json({ imageUrl: imageUrl });
};

exports.getUpload = (req, res) => {
  console.log("Recent Uploads:", recentUploads);
  const lastUpload = recentUploads[recentUploads.length - 1];
  if (lastUpload) {
    res.json({ imageUrl: lastUpload });
  } else {
    res.status(404).send("Sem imagens ainda.");
  }
};
