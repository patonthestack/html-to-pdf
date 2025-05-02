const fs = require('fs');
const path = require('path');
const html_to_pdf = require('html-pdf-node');

const inputDir = path.join(__dirname, 'html');
const outputDir = path.join(__dirname, 'pdfs');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.readdir(inputDir, (err, files) => {
  if (err) return console.error('Error reading input directory:', err);

  files.forEach(async (file) => {
    if (path.extname(file) === '.html') {
      const htmlFilePath = path.resolve(inputDir, file);

      const fileObj = {
        url: `file://${htmlFilePath}`,
      };

      const outputFilePath = path.join(outputDir, file.replace('.html', '.pdf'));

      html_to_pdf.generatePdf(fileObj, { format: 'A4' })
        .then((pdfBuffer) => {
          fs.writeFileSync(outputFilePath, pdfBuffer);
          console.log(`Converted: ${file} → ${outputFilePath}`);
        })
        .catch((err) => {
          console.error(`Failed to convert ${file}:`, err.message);
        });
    }
  });
});
