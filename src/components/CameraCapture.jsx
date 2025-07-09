import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { uploadToCloudinary } from '../utils/cloudinary';

export default function CameraCapture({ onPhotosCaptured }) {
  const webcamRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const videoConstraints = {
    facingMode: 'environment',
    aspectRatio: 16 / 9,
  };

  function capture() {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhotos([...photos, imageSrc]);
  }

  async function handleUpload() {
    setUploading(true);
    setError(null);
    try {
      const uploaded = [];
      for (const photo of photos) {
        // Convert base64 to blob
        const res = await fetch(photo);
        const blob = await res.blob();
        const result = await uploadToCloudinary(blob);
        uploaded.push(result.secure_url);
      }
      onPhotosCaptured(uploaded);
      setPhotos([]);
    } catch (err) {
      setError('Upload gagal: ' + err.message);
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Camera Preview */}
      <div className="relative w-full max-w-md bg-black rounded-lg overflow-hidden">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          style={{ transform: `scale(${zoom})` }}
          className="w-full h-auto object-cover"
        />
        
        {/* Zoom Control */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 bg-black bg-opacity-50 rounded-lg p-2">
            <span className="text-white text-xs">Zoom</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-white text-xs">{zoom.toFixed(1)}x</span>
          </div>
        </div>
      </div>

      {/* Camera Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button onClick={capture} className="btn btn-primary">
          📷 Take Photo
        </button>
        <button 
          onClick={() => setPhotos([])} 
          className="btn btn-secondary"
          disabled={photos.length === 0}
        >
          🔄 Reset
        </button>
      </div>

      {/* Photo Previews */}
      {photos.length > 0 && (
        <div className="w-full">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Captured Photos ({photos.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {photos.map((photo, i) => (
              <div key={i} className="relative group">
                <img 
                  src={photo} 
                  alt={`Preview ${i + 1}`} 
                  className="w-full h-20 object-cover rounded-lg border-2 border-gray-200" 
                />
                <button
                  onClick={() => setPhotos(photos.filter((_, index) => index !== i))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="w-full flex flex-col items-center gap-2">
        <button
          onClick={handleUpload}
          className="btn btn-success w-full sm:w-auto"
          disabled={uploading || photos.length === 0}
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Uploading...
            </div>
          ) : (
            `🔄 Upload & Complete (${photos.length} photos)`
          )}
        </button>
        
        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200 w-full">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
