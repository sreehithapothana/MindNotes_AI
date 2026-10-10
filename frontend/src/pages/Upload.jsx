import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Loader, CheckCircle, AlertCircle, Type } from 'lucide-react';
import api from '../services/api';

export default function Upload() {
  const [activeTab, setActiveTab] = useState('audio'); // 'audio' or 'text'
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState('meeting');
  const [textContent, setTextContent] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!title) {
        // Auto-fill title from filename
        const name = e.target.files[0].name.split('.')[0];
        setTitle(name.charAt(0).toUpperCase() + name.slice(1));
      }
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      if (!title) {
        const name = e.dataTransfer.files[0].name.split('.')[0];
        setTitle(name.charAt(0).toUpperCase() + name.slice(1));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      let res;
      if (activeTab === 'audio') {
        if (!file) throw new Error("Please select an audio file.");
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title || 'Untitled Audio');
        formData.append('mode', mode);
        
        res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        if (!textContent.trim()) throw new Error("Transcript content cannot be empty.");
        res = await api.post('/upload', {
          title: title || 'Untitled Transcript',
          mode,
          textContent
        });
      }
      
      // Success, redirect to transcript page
      navigate(`/transcript/${res.data._id}`);
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred during processing.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create a New Session</h1>
        <p className="text-gray-500 mt-2">Upload an audio recording or paste an existing transcript for AI analysis.</p>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center shadow-sm">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="card-soft overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button 
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center transition-colors ${activeTab === 'audio' ? 'text-lavender-dark border-b-2 border-lavender bg-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <UploadCloud className="w-4 h-4 mr-2" /> Upload Audio
          </button>
          <button 
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center transition-colors ${activeTab === 'text' ? 'text-lavender-dark border-b-2 border-lavender bg-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <Type className="w-4 h-4 mr-2" /> Paste Transcript
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Q3 Marketing Strategy"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-lavender-light focus:bg-white transition-all outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Mode</label>
              <select 
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-lavender-light focus:bg-white transition-all outline-none"
              >
                <option value="meeting">Business Meeting (Decisions, Action Items)</option>
                <option value="lecture">Academic Lecture (Study Notes, Quiz)</option>
              </select>
            </div>
          </div>

          {activeTab === 'audio' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Audio File (MP3, WAV, M4A)</label>
              <div 
                className={`mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-dashed rounded-2xl transition-colors ${file ? 'border-lavender bg-lavender/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-lavender-light'}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <div className="space-y-2 text-center cursor-pointer">
                  {file ? (
                    <>
                      <div className="mx-auto w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center text-lavender mb-4">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <div className="mx-auto w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center text-gray-400 mb-4">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <p className="text-base text-gray-600">
                        <span className="font-semibold text-lavender-dark">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">Maximum file size: 25MB</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="audio/mpeg,audio/wav,audio/m4a,audio/mp4" 
                  onChange={handleFileChange}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transcript Content</label>
              <textarea 
                rows="10"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste your meeting or lecture transcript here..."
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-lavender-light focus:bg-white transition-all outline-none resize-y"
                required
              ></textarea>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={uploading || (activeTab === 'audio' && !file)}
              className="btn-primary w-full py-3 text-lg relative overflow-hidden"
            >
              {uploading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Process Session'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
