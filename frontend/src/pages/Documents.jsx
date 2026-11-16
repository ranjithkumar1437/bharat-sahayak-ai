
import { useRef, useState } from "react";

import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Brain,
  ShieldCheck,
  FileImage,
  X,
  Loader2,
  ScanText,
  ClipboardCheck
} from "lucide-react";

import { uploadDocument } from "../services/api";
import "./Documents.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png"
];

function Documents() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // SELECT AND VALIDATE FILE
  const selectFile = (selectedFile) => {
    setError("");
    setResult(null);
    setProgress(0);

    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setFile(null);
      setError("Only PDF, JPG and PNG files are allowed.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setError("File size must not exceed 10 MB.");
      return;
    }

    setFile(selectedFile);
  };

  // UPLOAD DOCUMENT
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a document first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setProgress(0);

    try {
      const data = await uploadDocument(file, setProgress);

      setResult(data);
      setProgress(100);

    } catch (err) {
      setError(
        err.message || "Document upload failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // REMOVE SELECTED FILE
  const removeFile = () => {
    if (loading) return;

    setFile(null);
    setResult(null);
    setError("");
    setProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // FORMAT FILE SIZE
  const formatFileSize = (bytes = 0) => {
    if (bytes < 1024) return `${bytes} Bytes`;

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // DRAG AND DROP
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    selectFile(e.dataTransfer.files?.[0]);
  };

  return (
    <main className="documents-page">

      {/* PAGE HEADER */}
      <section className="documents-heading">

        <div className="documents-badge">
          <ShieldCheck size={16} />
          AI DOCUMENT INTELLIGENCE
        </div>

        <h1>Document Assistant</h1>

        <p>
          Upload your government documents and let AI extract
          and analyze important information.
        </p>

      </section>

      {/* UPLOAD CARD */}
      <section className="upload-card">

        <div className="upload-icon">
          <ScanText size={30} />
        </div>

        <h2>Upload Your Document</h2>

        <p>
          Drag and drop your document here or browse your device.
        </p>

        {/* DROPZONE */}
        <div
          className={`upload-dropzone ${dragging ? "dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragging(false);
          }}
          onDrop={handleDrop}
          onClick={() => {
            if (!loading) fileInputRef.current?.click();
          }}
          role="button"
          tabIndex={0}
          aria-label="Choose a document to upload"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();

              if (!loading) fileInputRef.current?.click();
            }
          }}
        >

          <Upload size={35} />

          <h3>Drop your file here</h3>

          <span>or click to browse files</span>

          <small>PDF, JPG, PNG · Maximum 10 MB</small>

          <input
            ref={fileInputRef}
            className="file-select"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => selectFile(e.target.files?.[0])}
            onClick={(e) => e.stopPropagation()}
            disabled={loading}
          />

        </div>

        {/* SELECTED FILE */}
        {file && (
          <div className="selected-file">

            <FileText size={25} />

            <div className="selected-file-info">
              <strong>{file.name}</strong>
              <span>{formatFileSize(file.size)}</span>
            </div>

            <button
              type="button"
              className="remove-file"
              onClick={removeFile}
              disabled={loading}
              aria-label="Remove selected file"
            >
              <X size={19} />
            </button>

          </div>
        )}

        {/* UPLOAD PROGRESS */}
        {loading && (
          <div className="upload-progress">

            <div className="progress-label">
              <span>Uploading and analyzing document...</span>
              <span>{progress}%</span>
            </div>

            <div
              className="progress-track"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

          </div>
        )}

        {/* UPLOAD BUTTON */}
        <button
          type="button"
          className="upload-button"
          onClick={handleUpload}
          disabled={loading || !file}
        >

          {loading ? (
            <>
              <Loader2 className="loading-spinner" size={19} />
              Analyzing Document...
            </>
          ) : (
            <>
              <Brain size={19} />
              Upload and Analyze
            </>
          )}

        </button>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="upload-error" role="alert">
            <AlertCircle size={19} />
            <span>{error}</span>
          </div>
        )}

        {/* SECURITY INFORMATION */}
        <div className="upload-security">
          <ShieldCheck size={17} />
          Files are processed temporarily by the backend endpoint.
        </div>

      </section>

      {/* DOCUMENT ANALYSIS RESULTS */}
      {result && (
        <section className="document-result">

          {/* SUCCESS HEADER */}
          <div className="result-success">

            <CheckCircle size={25} />

            <div>
              <h2>Document Processed Successfully</h2>
              <p>{result.filename}</p>
            </div>

          </div>

          {/* FILE INFORMATION */}
          <div className="document-meta">

            <div>
              <span>Processing Status</span>
              <strong>{result.status || "Completed"}</strong>
            </div>

            <div>
              <span>File Size</span>
              <strong>{formatFileSize(result.size_bytes)}</strong>
            </div>

            <div>
              <span>OCR</span>
              <strong>
                {result.ocr_enabled ? "Enabled" : "Not enabled"}
              </strong>
            </div>

          </div>

          {/* AI ANALYSIS */}
          {result.analysis && (
            <div className="analysis-section">

              <h2>
                <Brain size={23} />
                AI Document Analysis
              </h2>

              {/* DOCUMENT TYPE */}
              <div className="document-type-card">

                <FileImage size={26} />

                <div>
                  <span>Detected Document Type</span>

                  <h3>
                    {result.analysis.document_type || "Not identified"}
                  </h3>
                </div>

              </div>

              {/* DOCUMENT CHECKS */}
              <h3 className="result-subheading">
                Document Checks
              </h3>

              <div className="document-checks">

                {Object.entries(result.analysis.checks || {}).map(
                  ([name, found]) => (
                    <div className="document-check" key={name}>

                      {found ? (
                        <CheckCircle size={18} />
                      ) : (
                        <AlertCircle size={18} />
                      )}

                      <span>
                        {name.replaceAll("_", " ")}
                      </span>

                      <strong>
                        {found ? "Found" : "Not detected"}
                      </strong>

                    </div>
                  )
                )}

              </div>

              {/* ITEMS TO REVIEW */}
              <h3 className="result-subheading">
                Items to Review
              </h3>

              {result.analysis.missing_items?.length > 0 ? (
                <ul className="missing-items">
                  {result.analysis.missing_items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No missing items detected by demo checks.</p>
              )}

              {/* ANALYSIS MESSAGE */}
              {result.analysis.message && (
                <p className="analysis-message">
                  {result.analysis.message}
                </p>
              )}

              {/* ANALYSIS DISCLAIMER */}
              {result.analysis.disclaimer && (
                <div className="privacy-note">
                  <ShieldCheck size={17} />
                  <span>{result.analysis.disclaimer}</span>
                </div>
              )}

            </div>
          )}

          {/* OCR EXTRACTED TEXT */}
          {result.extracted_text && (
            <div className="extracted-section">

              <h2>
                <FileText size={22} />
                Extracted OCR Text
              </h2>

              <pre className="extracted-text">
                {result.extracted_text}
              </pre>

            </div>
          )}

          {/* PRIVACY NOTE */}
          <div className="privacy-note">
            <ShieldCheck size={17} />

            <span>
              This endpoint processes uploaded files in memory.
              It does not permanently store them.
            </span>
          </div>

        </section>
      )}

    </main>
  );
}

export default Documents;
