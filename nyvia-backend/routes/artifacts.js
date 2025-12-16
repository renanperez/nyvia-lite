const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|docx|doc|txt|md/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF, DOCX, DOC, TXT, MD são permitidos'));
    }
  }
});

router.get('/:workspaceId', (req, res) => {
  const { workspaceId } = req.params;
  const artifacts = db.getArtifactsByWorkspace(workspaceId);
  res.json({ artifacts });
});

router.post('/:workspaceId', upload.single('file'), (req, res) => {
  try {
    const { workspaceId } = req.params;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    console.log('🔍 Workspace ID:', workspaceId);
    console.log('🔍 Workspace existe?', db.getWorkspaceById(workspaceId));
    
    const artifactId = db.createArtifact(
      workspaceId,
      file.filename,
      file.originalname,
      file.path,
      file.mimetype,
      file.size
    );

    const artifact = db.getArtifactById(artifactId);
    res.status(201).json({ artifact });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    res.status(500).json({ error: 'Erro ao fazer upload do arquivo' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const artifact = db.getArtifactById(id);
    
    if (!artifact) {
      return res.status(404).json({ error: 'Artefato não encontrado' });
    }

    if (fs.existsSync(artifact.file_path)) {
      fs.unlinkSync(artifact.file_path);
    }

    db.deleteArtifact(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar:', error);
    res.status(500).json({ error: 'Erro ao deletar arquivo' });
  }
});

module.exports = router;