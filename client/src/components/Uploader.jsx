import { useRef, useState } from 'react';
import api from '../lib/api';

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
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const addFiles = (selected) => {
    const incoming = Array.from(selected).filter((file) => allowedTypes.includes(file.type));
    const combined = [...files, ...incoming].slice(0, 10);
    setFiles(combined);
    if (incoming.length !== selected.length) {
      setError('Only PDF, JPG, or PNG files are allowed.');
    } else {
      setError(null);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files?.length) {
      addFiles(event.dataTransfer.files);
    }
  };

  const handleBrowse = (event) => {
    addFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!files.length) {
      setError('Please add at least one invoice.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      setUploading(true);
      setError(null);
      const response = await api.post('/api/invoices/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFiles([]);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      onUploadComplete?.(response.data?.invoices || []);
    } catch (err) {
      const message = err.response?.data?.error || 'Upload failed. Please try again.';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="uploader">
      <div
        className="dropzone"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
      >
        <div>
          <h3>Drop invoices here</h3>
          <p>PDF, JPG, or PNG. Up to 10 files per batch.</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleBrowse}
        />
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <div className="file-list-header">
            <span>{files.length} file(s) ready</span>
            <button type="button" className="link" onClick={() => setFiles([])}>
              Clear
            </button>
          </div>
          <ul>
            {files.map((file) => (
              <li key={`${file.name}-${file.size}`}>
                <span>{file.name}</span>
                <span className="muted">{formatFileSize(file.size)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <div className="alert">{error}</div>}

      <button className="primary" type="button" onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Analyzing...' : 'Analyze'}
      </button>
    </div>
  );
}
