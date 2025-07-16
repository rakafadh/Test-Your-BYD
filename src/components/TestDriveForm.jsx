import React, { useState } from 'react';
import { useTestDrive } from '../context/TestDriveContext';
import CameraCapture from './CameraCapture';
import { supabase } from '../utils/supabase';

const initialState = {
  customer_name: '',
  employee_name: '',
  date_time: '',
  status: '',
  police_number: '',
  car_model: '',
  notes: '',
  front_photo: '',
  back_photo: '',
  left_photo: '',
  right_photo: '',
  mid_photo: '',
  form_photo: ''
};

export default function TestDriveForm() {
  // Get current datetime in local timezone for default value
  const getCurrentLocalDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [form, setForm] = useState({
    ...initialState,
    date_time: getCurrentLocalDateTime()
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [currentPhotoType, setCurrentPhotoType] = useState('');
  const { testDrives, addTestDrive, fetchTestDrives, isOnline, offlineQueue, showSuccess, showError } = useTestDrive();
  function validate() {
    const errs = {};
    if (!form.customer_name) errs.customer_name = 'Wajib diisi';
    if (!form.employee_name) errs.employee_name = 'Wajib diisi';
    if (!form.date_time) errs.date_time = 'Wajib diisi';
    if (!form.status) errs.status = 'Wajib diisi';
    if (!form.police_number) errs.police_number = 'Wajib diisi';
    if (!form.car_model) errs.car_model = 'Wajib diisi';
    
    // Validate required photos
    if (!form.front_photo) errs.front_photo = 'Foto depan wajib diambil';
    if (!form.back_photo) errs.back_photo = 'Foto belakang wajib diambil';
    if (!form.left_photo) errs.left_photo = 'Foto kiri wajib diambil';
    if (!form.right_photo) errs.right_photo = 'Foto kanan wajib diambil';
    if (!form.mid_photo) errs.mid_photo = 'Foto tengah wajib diambil';
    if (!form.form_photo) errs.form_photo = 'Foto form test drive wajib diambil';
    
    return errs;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    
    setSubmitting(true);
    try {
      // Convert datetime-local to ISO string with local timezone
      const localDateTime = new Date(form.date_time);
      const payload = { 
        ...form,
        date_time: localDateTime.toISOString()
      };
      
      const result = await addTestDrive(payload);
      if (result.success) {
        if (result.offline) {
          showSuccess('Data saved offline and will sync when online.');
        } else {
          showSuccess('Test drive record saved successfully!');
        }
        
        // Reset form
        setForm({
          ...initialState,
          date_time: getCurrentLocalDateTime()
        });
      }
    } catch (err) {
      showError('Failed to save: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handlePhotosCaptured(urls) {
    if (urls && urls.length > 0 && currentPhotoType) {
      setForm(f => ({ ...f, [currentPhotoType]: urls[0] }));
      setErrors(prev => ({ ...prev, [currentPhotoType]: null }));
    }
    setShowCamera(false);
    setCurrentPhotoType('');
  }

  function openCamera(photoType) {
    setCurrentPhotoType(photoType);
    setShowCamera(true);
  }  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="card">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Test Drive Form</h2>
        <p className="text-sm text-gray-600 mb-6">
          Fields marked with * are required. All vehicle photos must be taken before submitting.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                className="input"
                placeholder="Enter customer name"
              />
              {errors.customer_name && (
                <div className="text-red-600 text-sm mt-1">{errors.customer_name}</div>
              )}
            </div>

            {/* Employee Name */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee Name *
              </label>
              <input
                name="employee_name"
                value={form.employee_name}
                onChange={handleChange}
                className="input"
                placeholder="Enter employee name"
              />
              {errors.employee_name && (
                <div className="text-red-600 text-sm mt-1">{errors.employee_name}</div>
              )}
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                name="date_time"
                value={form.date_time}
                onChange={handleChange}
                className="input"
              />
              {errors.date_time && (
                <div className="text-red-600 text-sm mt-1">{errors.date_time}</div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select 
                name="status" 
                value={form.status} 
                onChange={handleChange} 
                className="input"
              >
                <option value="">Select Status</option>
                <option value="OUT">OUT</option>
                <option value="IN">IN</option>
              </select>
              {errors.status && (
                <div className="text-red-600 text-sm mt-1">{errors.status}</div>
              )}
            </div>

            {/* Police Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Police Number *
              </label>
              <input
                name="police_number"
                value={form.police_number}
                onChange={handleChange}
                className="input"
                placeholder="e.g., B 1234 ABC"
              />
              {errors.police_number && (
                <div className="text-red-600 text-sm mt-1">{errors.police_number}</div>
              )}
            </div>

            {/* BYD Car Model */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BYD Car Model *
              </label>
              <input
                name="car_model"
                value={form.car_model}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Seal, Atto 3, Tang"
              />
              {errors.car_model && (
                <div className="text-red-600 text-sm mt-1">{errors.car_model}</div>
              )}
            </div>

            {/* Vehicle Condition Notes */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Condition Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="input"
                rows="3"
                placeholder="Any scratches, damages, or notes about the vehicle condition..."
              />
            </div>

            {/* Photo Sections */}
            <div className="sm:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-t pt-4">
                Vehicle Photos *
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Take photos from all required angles. Each photo is mandatory.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Front Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Front Side Photo *
                  </label>
                  {form.front_photo ? (
                    <div className="relative">
                      <img 
                        src={form.front_photo} 
                        alt="Front view" 
                        className="w-full h-24 object-cover rounded-lg border-2 border-green-200" 
                      />
                      <button
                        type="button"
                        onClick={() => openCamera('front_photo')}
                        className="absolute inset-0 bg-black bg-opacity-50 text-white text-xs rounded-lg opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openCamera('front_photo')}
                      className={`w-full h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                        errors.front_photo ? 'border-red-300 text-red-600' : 'border-gray-300 text-gray-600 hover:border-blue-400'
                      }`}
                    >
                      📷
                      <span>Take Photo</span>
                    </button>
                  )}
                  {errors.front_photo && (
                    <div className="text-red-600 text-xs mt-1">{errors.front_photo}</div>
                  )}
                </div>

                {/* Back Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Back Side Photo *
                  </label>
                  {form.back_photo ? (
                    <div className="relative">
                      <img 
                        src={form.back_photo} 
                        alt="Back view" 
                        className="w-full h-24 object-cover rounded-lg border-2 border-green-200" 
                      />
                      <button
                        type="button"
                        onClick={() => openCamera('back_photo')}
                        className="absolute inset-0 bg-black bg-opacity-50 text-white text-xs rounded-lg opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openCamera('back_photo')}
                      className={`w-full h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                        errors.back_photo ? 'border-red-300 text-red-600' : 'border-gray-300 text-gray-600 hover:border-blue-400'
                      }`}
                    >
                      📷
                      <span>Take Photo</span>
                    </button>
                  )}
                  {errors.back_photo && (
                    <div className="text-red-600 text-xs mt-1">{errors.back_photo}</div>
                  )}
                </div>

                {/* Left Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Left Side Photo *
                  </label>
                  {form.left_photo ? (
                    <div className="relative">
                      <img 
                        src={form.left_photo} 
                        alt="Left view" 
                        className="w-full h-24 object-cover rounded-lg border-2 border-green-200" 
                      />
                      <button
                        type="button"
                        onClick={() => openCamera('left_photo')}
                        className="absolute inset-0 bg-black bg-opacity-50 text-white text-xs rounded-lg opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openCamera('left_photo')}
                      className={`w-full h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                        errors.left_photo ? 'border-red-300 text-red-600' : 'border-gray-300 text-gray-600 hover:border-blue-400'
                      }`}
                    >
                      📷
                      <span>Take Photo</span>
                    </button>
                  )}
                  {errors.left_photo && (
                    <div className="text-red-600 text-xs mt-1">{errors.left_photo}</div>
                  )}
                </div>

                {/* Right Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Right Side Photo *
                  </label>
                  {form.right_photo ? (
                    <div className="relative">
                      <img 
                        src={form.right_photo} 
                        alt="Right view" 
                        className="w-full h-24 object-cover rounded-lg border-2 border-green-200" 
                      />
                      <button
                        type="button"
                        onClick={() => openCamera('right_photo')}
                        className="absolute inset-0 bg-black bg-opacity-50 text-white text-xs rounded-lg opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openCamera('right_photo')}
                      className={`w-full h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                        errors.right_photo ? 'border-red-300 text-red-600' : 'border-gray-300 text-gray-600 hover:border-blue-400'
                      }`}
                    >
                      📷
                      <span>Take Photo</span>
                    </button>
                  )}
                  {errors.right_photo && (
                    <div className="text-red-600 text-xs mt-1">{errors.right_photo}</div>
                  )}
                </div>

                {/* Mid Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MID Photo *
                  </label>
                  {form.mid_photo ? (
                    <div className="relative">
                      <img 
                        src={form.mid_photo} 
                        alt="Mid view" 
                        className="w-full h-24 object-cover rounded-lg border-2 border-green-200" 
                      />
                      <button
                        type="button"
                        onClick={() => openCamera('mid_photo')}
                        className="absolute inset-0 bg-black bg-opacity-50 text-white text-xs rounded-lg opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openCamera('mid_photo')}
                      className={`w-full h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                        errors.mid_photo ? 'border-red-300 text-red-600' : 'border-gray-300 text-gray-600 hover:border-blue-400'
                      }`}
                    >
                      📷
                      <span>Take Photo</span>
                    </button>
                  )}
                  {errors.mid_photo && (
                    <div className="text-red-600 text-xs mt-1">{errors.mid_photo}</div>
                  )}
                </div>

                {/* Form Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Form Test Drive Photo *
                  </label>
                  {form.form_photo ? (
                    <div className="relative">
                      <img 
                        src={form.form_photo} 
                        alt="Form test drive" 
                        className="w-full h-24 object-cover rounded-lg border-2 border-green-200" 
                      />
                      <button
                        type="button"
                        onClick={() => openCamera('form_photo')}
                        className="absolute inset-0 bg-black bg-opacity-50 text-white text-xs rounded-lg opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openCamera('form_photo')}
                      className={`w-full h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                        errors.form_photo ? 'border-red-300 text-red-600' : 'border-gray-300 text-gray-600 hover:border-blue-400'
                      }`}
                    >
                      📷
                      <span>Take Photo</span>
                    </button>
                  )}
                  {errors.form_photo && (
                    <div className="text-red-600 text-xs mt-1">{errors.form_photo}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
            <button
              type="submit"
              className="btn btn-primary flex-1 sm:flex-none"
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                'Save Test Drive'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="modal-overlay">
          <div className="modal-content p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Take {currentPhotoType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowCamera(false);
                  setCurrentPhotoType('');
                }}
                className="btn btn-secondary p-2"
              >
                Close
              </button>
            </div>
            <CameraCapture onPhotosCaptured={handlePhotosCaptured} />
          </div>
        </div>
      )}
    </div>
  );
}
