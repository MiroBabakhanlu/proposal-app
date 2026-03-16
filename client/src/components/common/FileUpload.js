
import React, { useState, useEffect } from 'react';
import { validateFile } from '../../utils/validation';

const FileUpload = ({ onFileChange, error, onError, resetSignal }) => {
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [localError, setLocalError] = useState('');
  const [inputKey, setInputKey] = useState(Date.now()); // force re-render

  useEffect(() => {
    if (resetSignal) {
      setFileName('');
      setFileSize('');
      setLocalError('');
      setInputKey(Date.now()); 
    }
  }, [resetSignal]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setLocalError('');

    if (!file) {
      setFileName('');
      setFileSize('');
      onFileChange(null);
      onError?.('', '');
      return;
    }

    const result = validateFile(file);
    if (!result.isValid) {
      const errorMsg = result.errors.file;
      setLocalError(errorMsg);
      onError?.('file', errorMsg);
      onFileChange(null);
      e.target.value = '';
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / 1024 / 1024).toFixed(2));
    onFileChange(file);
    onError?.('file', '');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Attach PDF (optional, max 4MB)
      </label>
      <div className={`border-2 border-dashed rounded-lg p-4 ${
        localError ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
      }`}>
        <input
          key={inputKey} 
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {fileName && !localError && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700 font-medium">{fileName}</p>
            <p className="text-xs text-gray-500 mt-1">{fileSize} MB - Ready to upload</p>
          </div>
        )}

        {localError && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600 font-medium">File rejected</p>
            <p className="text-sm text-red-600">{localError}</p>
            <p className="text-xs text-gray-500 mt-1">Please select a different file</p>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-2">Only PDF files up to 4MB are allowed</p>
      </div>
    </div>
  );
};

export default FileUpload;