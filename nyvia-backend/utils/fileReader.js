const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

async function readArtifactContent(filePath, fileType) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    
    // TXT e MD
    if (ext === '.txt' || ext === '.md') {
      return fs.readFileSync(filePath, 'utf8');
    }
    
    // PDF
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    }

    // DOC e DOCX
    if (ext === '.docx' || ext === '.doc') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    }
    
    return '';
  } catch (error) {
    console.error('Erro ao ler arquivo:', error);
    return '';
  }
}

module.exports = { readArtifactContent };