import React, { useState } from 'react';
import { useTestDrive } from '../../context/TestDriveContext';
import CameraCapture from '../CameraCapture';
import { supabase } from '../../utils/supabase';

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
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function handleTakePhoto(type) {
    setCurrentPhotoType(type);
    setShowCamera(true);
  }

  function handlePhotoCapture(photoUrl) {
    setForm(prev => ({ ...prev, [currentPhotoType]: photoUrl }));
    setShowCamera(false);
    setCurrentPhotoType('');
    if (errors[currentPhotoType]) {
      setErrors(prev => ({ ...prev, [currentPhotoType]: '' }));
    }
  }

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={handlePhotoCapture}
        onCancel={() => {
          setShowCamera(false);
          setCurrentPhotoType('');
        }}
        title={`Take ${currentPhotoType.replace('_', ' ').replace(/([A-Z])/g, ' $1').toLowerCase()}`}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          New Test Drive
        </h2>
        <p className="text-sm text-gray-600 mb-4 sm:mb-6">
          Fields marked with * are required. All vehicle photos must be taken before submitting.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {/* Customer Name */}
            <div>
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
            <div>
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

            {/* Date & Time and Status in Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>

            {/* Police Number and Car Model in Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* Car Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BYD Car Model *
                </label>
                <input
                  name="car_model"
                  value={form.car_model}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Atto 3, Dolphin, Seal"
                />
                {errors.car_model && (
                  <div className="text-red-600 text-sm mt-1">{errors.car_model}</div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Condition Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                className="input"
                placeholder="Note any vehicle condition details, damages, or observations..."
              />
            </div>
          </div>

          {/* Photo Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Photo Documentation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Front Photo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Front Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {form.front_photo ? (
                    <div className="space-y-2">
                      <img 
                        src={form.front_photo} 
                        alt="Front" 
                        className="w-full h-32 object-cover rounded mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => handleTakePhoto('front_photo')}
                        className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTakePhoto('front_photo')}
                      className="btn bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Take Front Photo
                    </button>
                  )}
                </div>
                {errors.front_photo && (
                  <div className="text-red-600 text-sm">{errors.front_photo}</div>
                )}
              </div>

              {/* Back Photo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Back Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {form.back_photo ? (
                    <div className="space-y-2">
                      <img 
                        src={form.back_photo} 
                        alt="Back" 
                        className="w-full h-32 object-cover rounded mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => handleTakePhoto('back_photo')}
                        className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTakePhoto('back_photo')}
                      className="btn bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Take Back Photo
                    </button>
                  )}
                </div>
                {errors.back_photo && (
                  <div className="text-red-600 text-sm">{errors.back_photo}</div>
                )}
              </div>

              {/* Left Photo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Left Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {form.left_photo ? (
                    <div className="space-y-2">
                      <img 
                        src={form.left_photo} 
                        alt="Left" 
                        className="w-full h-32 object-cover rounded mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => handleTakePhoto('left_photo')}
                        className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTakePhoto('left_photo')}
                      className="btn bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Take Left Photo
                    </button>
                  )}
                </div>
                {errors.left_photo && (
                  <div className="text-red-600 text-sm">{errors.left_photo}</div>
                )}
              </div>

              {/* Right Photo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Right Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {form.right_photo ? (
                    <div className="space-y-2">
                      <img 
                        src={form.right_photo} 
                        alt="Right" 
                        className="w-full h-32 object-cover rounded mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => handleTakePhoto('right_photo')}
                        className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTakePhoto('right_photo')}
                      className="btn bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Take Right Photo
                    </button>
                  )}
                </div>
                {errors.right_photo && (
                  <div className="text-red-600 text-sm">{errors.right_photo}</div>
                )}
              </div>

              {/* Mid Photo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mid Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {form.mid_photo ? (
                    <div className="space-y-2">
                      <img 
                        src={form.mid_photo} 
                        alt="Mid" 
                        className="w-full h-32 object-cover rounded mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => handleTakePhoto('mid_photo')}
                        className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTakePhoto('mid_photo')}
                      className="btn bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Take Mid Photo
                    </button>
                  )}
                </div>
                {errors.mid_photo && (
                  <div className="text-red-600 text-sm">{errors.mid_photo}</div>
                )}
              </div>

              {/* Form Photo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Form Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {form.form_photo ? (
                    <div className="space-y-2">
                      <img 
                        src={form.form_photo} 
                        alt="Form" 
                        className="w-full h-32 object-cover rounded mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => handleTakePhoto('form_photo')}
                        className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTakePhoto('form_photo')}
                      className="btn bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Take Form Photo
                    </button>
                  )}
                </div>
                {errors.form_photo && (
                  <div className="text-red-600 text-sm">{errors.form_photo}</div>
                )}
              </div>

            </div>
          </div>

          {/* Notes */}
          {/* Offline Queue Info */}
          {!isOnline && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-yellow-800 font-medium">Offline Mode</div>
              <div className="text-yellow-600 text-sm mt-1">
                You're currently offline. Data will be saved locally and synced when connection is restored.
                {offlineQueue.length > 0 && ` (${offlineQueue.length} items in queue)`}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary flex-1 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Test Drive Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
