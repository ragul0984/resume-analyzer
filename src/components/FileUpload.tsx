"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AnalysisData } from './Dashboard';

interface Props {
  onComplete: (data: AnalysisData) => void;
  isAuthenticated?: boolean;
  onAuthRequired?: () => void;
}

export default function FileUpload({ onComplete, isAuthenticated = true, onAuthRequired }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!isAuthenticated && onAuthRequired) {
      onAuthRequired();
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.docx')) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }

    setIsUploading(true);
    setStatusText('Extracting text...');
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      // 1. Parse File
      const parseRes = await fetch('/api/parse', { method: 'POST', body: formData });
      
      if (!parseRes.ok) {
        let backendError = 'Failed to extract text from file.';
        try {
          const errData = await parseRes.json();
          if (errData.error) backendError = errData.error;
        } catch (e) { }
        throw new Error(backendError);
      }
      
      const parseData = await parseRes.json();

      if (!parseData.text) throw new Error('No text found in document.');

      // 2. Analyze Text with AI
      setStatusText('Analyzing with AI...');
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: parseData.text })
      });

      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok || analyzeData.error) {
        const errMsg = analyzeData.details 
          ? `${analyzeData.error}: ${analyzeData.details}`
          : (analyzeData.error || 'AI Analysis failed.');
        throw new Error(errMsg);
      }

      onComplete(analyzeData.analysis as AnalysisData);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsUploading(false);
      setStatusText('');
    }
  }, [onComplete, isAuthenticated, onAuthRequired]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    noClick: !isAuthenticated,
    noKeyboard: !isAuthenticated,
  });

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated && onAuthRequired) {
      e.stopPropagation();
      e.preventDefault();
      onAuthRequired();
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <div 
        {...getRootProps({
          onClick: handleClick
        })} 
        className="panel"
        style={{ 
          padding: "2rem", 
          cursor: "pointer", 
          borderColor: isDragActive ? "var(--primary-color)" : "",
          backgroundColor: isDragActive ? "rgba(37, 99, 235, 0.05)" : "var(--panel-bg)",
        }}
      >
        <input {...getInputProps()} />
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          {isUploading ? "⏳" : "📄"}
        </div>
        <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem", fontWeight: "600", color: "var(--text-primary)" }}>
          {isUploading ? statusText : "Upload Resume"}
        </h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.25rem", fontSize: "0.9rem", lineHeight: "1.4" }}>
          {isDragActive ? "Drop the file here" : "Drag and drop your PDF or DOCX file here, or click to browse"}
        </p>
        <button type="button" disabled={isUploading} className="btn" style={{ width: "100%", padding: "12px", fontSize: "1.1rem", opacity: isUploading ? 0.7 : 1 }}>
          {isUploading ? 'Processing Document...' : 'Select File'}
        </button>
      </div>

      {error && (
        <div style={{ 
          marginTop: '1.25rem', 
          padding: '1rem', 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: 'var(--danger)', 
          fontWeight: 500,
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
