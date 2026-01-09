import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import './Uploader.css';
const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Uploader({ onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const addFiles = (selected) => {
    const incoming = Array.from(selected).filter((file) => allowedTypes.includes(file.type));
    const combined = [...files, ...incoming].slice(0, 10);
    setFiles(combined);
    setError(incoming.length !== selected.length ? 'Only PDF, JPG, or PNG files are allowed.' : null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer?.files?.length) addFiles(event.dataTransfer.files);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!files.length) return setError('Please add at least one invoice.');
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      setUploading(true);
      setError(null);
      const response = await api.post('/api/invoices/upload', formData);
      setFiles([]);
      onUploadComplete?.(response.data?.invoices || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Azure Analysis failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="uploader-container">
      <motion.div
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="dropzone-content">
          <motion.div 
            animate={isDragging ? { y: -5, scale: 1.1 } : { y: 0 }}
            className="upload-icon"
          >
            {uploading ? '⌛' : '📤'}
          </motion.div>
          <h3>{uploading ? 'Azure AI is analyzing...' : 'Drop invoices here'}</h3>
          <p>Drag & Drop or click to browse (PDF, PNG, JPG)</p>
        </div>
        <input ref={inputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => addFiles(e.target.files)} hidden />
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="file-list-section"
          >
            <div className="list-header">
              <span>{files.length}/10 Files Queued</span>
              <button className="text-btn" onClick={() => setFiles([])}>Clear All</button>
            </div>
            <ul className="file-grid">
              {files.map((file, idx) => (
                <motion.li 
                  key={`${file.name}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="file-item"
                >
                  <div className="file-info">
                    <span className="file-ext">{file.name.split('.').pop().toUpperCase()}</span>
                    <div className="file-text">
                      <p className="file-name">{file.name}</p>
                      <p className="file-size">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeFile(idx); }}>✕</button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="error-banner">
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        className={`analyze-btn ${uploading ? 'loading' : ''}`}
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        whileHover={!uploading && files.length > 0 ? { scale: 1.02, boxShadow: "0 8px 20px rgba(0, 120, 212, 0.3)" } : {}}
        whileTap={{ scale: 0.98 }}
      >
        {uploading ? (
          <div className="loader-box">
             <div className="dot-pulse"></div>
             Running Cloud Audit...
          </div>
        ) : 'Start Security Scan'}
      </motion.button>
    </div>
  );
}