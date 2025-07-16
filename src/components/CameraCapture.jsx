import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { uploadToCloudinary } from '../utils/cloudinary';

export default function CameraCapture({ onPhotosCaptured }) {
  const webcamRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState(null);

  const videoConstraints = {
    facingMode: 'environment',
    aspectRatio: 16 / 9,
  };

  function capture() {
    if (capturing) return; // Prevent multiple captures while processing
    
    setCapturing(true);
    const imageSrc = webcamRef.current.getScreenshot();
    
    // If zoom is applied, we need to crop the image to match the zoomed view
    if (zoom > 1) {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate crop dimensions based on zoom
          const cropWidth = img.width / zoom;
          const cropHeight = img.height / zoom;
          const cropX = (img.width - cropWidth) / 2;
          const cropY = (img.height - cropHeight) / 2;
          
          // Set canvas to original size
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw the cropped and scaled image
          ctx.drawImage(
            img,
            cropX, cropY, cropWidth, cropHeight,  // Source crop area
            0, 0, canvas.width, canvas.height     // Destination full canvas
          );
          
          const zoomedImageSrc = canvas.toDataURL('image/jpeg', 0.8);
          setPhotos(prev => [...prev, zoomedImageSrc]);
        } catch (err) {
          console.error('Error processing zoomed image:', err);
          // Fallback to original image if zoom processing fails
          setPhotos(prev => [...prev, imageSrc]);
        } finally {
          setCapturing(false);
        }
      };
      img.onerror = () => {
        console.error('Error loading image for zoom processing');
        setPhotos(prev => [...prev, imageSrc]);
        setCapturing(false);
      };
      img.src = imageSrc;
    } else {
      // No zoom, use original image
      setPhotos(prev => [...prev, imageSrc]);
      setCapturing(false);
    }
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
      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
        <p>📷 Ambil foto kendaraan dari berbagai sudut</p>
        <p className="text-xs mt-1">💡 Gunakan zoom untuk fokus pada detail tertentu</p>
      </div>

      {/* Camera Preview */}
      <div className="relative w-full max-w-md bg-black rounded-lg overflow-hidden shadow-lg">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'center center'
          }}
          className="w-full h-auto object-cover"
        />
        
        {/* Zoom Control */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 bg-black bg-opacity-70 rounded-lg p-3">
            <span className="text-white text-xs font-medium">🔍</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-white text-xs font-medium min-w-[35px]">{zoom.toFixed(1)}x</span>
          </div>
          {zoom > 1 && (
            <div className="text-center mt-2">
              <span className="text-white text-xs bg-blue-500 bg-opacity-80 px-2 py-1 rounded">
                Foto akan disimpan sesuai zoom
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Camera Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button 
          onClick={capture} 
          className="btn btn-primary"
          disabled={capturing}
        >
          {capturing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            '📷 Take Photo'
          )}
        </button>
        <button 
          onClick={() => setPhotos([])} 
          className="btn btn-secondary"
          disabled={photos.length === 0 || capturing}
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
