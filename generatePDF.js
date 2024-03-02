const fs = require('fs');
const PDFDocument = require('pdfkit');
const express = require('express');
const path = require('path');

const app = express();
const port = 5000;

const generatePDF = () => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream('output.pdf');
    doc.pipe(stream);

    doc.fontSize(14).text('Hello, How are you?', 100, 100);

    const imagePath = path.join(__dirname, 'download.jpeg');
    doc.image(imagePath, 100, 150, { width: 200 });

    doc.end();
    stream.on('finish', () => {
      console.log('PDF created successfully');
      resolve();
    });
    stream.on('error', (error) => {
      reject(error);
    });
  });
};

app.get('/', (req, res) => {
  res.send('Server is running.');
});

app.get('/generatePDF', async (req, res) => {
  try {
    await generatePDF();
    const filePath = path.resolve('output.pdf');
    res.download(filePath, 'generated.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
