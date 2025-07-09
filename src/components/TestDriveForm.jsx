import React, { useState } from 'react';
import { useTestDrive } from '../context/TestDriveContext';
import CameraCapture from './CameraCapture';
import { supabase } from '../utils/supabase';

const initialState = {
  employee_name: '',
  date_time: '',
  status: '',
  car_model: '',
  plate_number: '',
  kilometer: '',
  fuel_condition: '',
  notes: '',
  photos: [],
};

export default function TestDriveForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);  const [photoUrls, setPhotoUrls] = useState([]);
  const { testDrives, addTestDrive, isOnline, offlineQueue, showSuccess, showError } = useTestDrive();
  function validate() {
    const errs = {};
    if (!form.employee_name) errs.employee_name = 'Wajib diisi';
    if (!form.date_time) errs.date_time = 'Wajib diisi';
    if (!form.status) errs.status = 'Wajib diisi';
    if (!form.car_model) errs.car_model = 'Wajib diisi';
    if (!form.plate_number) errs.plate_number = 'Wajib diisi';
    if (!form.kilometer || isNaN(form.kilometer)) errs.kilometer = 'Harus angka';
    if (!photoUrls || photoUrls.length === 0) errs.photos = 'Foto kendaraan wajib diambil';
    // Unique plat validation for OUT
    if (
      form.status === 'OUT' &&
      testDrives.some(
        td => td.plate_number === form.plate_number && td.status === 'OUT'
      )
    ) {
      errs.plate_number = 'Plat ini sudah OUT dan belum IN.';
    }
    return errs;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    
    setSubmitting(true);
    try {
      const payload = { 
        ...form, 
        kilometer: Number(form.kilometer), 
        photos: photoUrls 
      };
      
      const result = await addTestDrive(payload);
        if (result.success) {
        if (result.offline) {
          showSuccess('Data saved offline and will sync when online.');
        } else {
          showSuccess('Test drive record saved successfully!');
        }
        
        // Reset form
        setForm(initialState);
        setPhotoUrls([]);
      }
    } catch (err) {
      showError('Failed to save: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }
  function handlePhotosCaptured(urls) {
    setPhotoUrls(urls);
    setShowCamera(false);
    // Clear photo error if photos are captured
    if (urls && urls.length > 0) {
      setErrors(prev => ({ ...prev, photos: null }));
    }
  }  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="card">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Test Drive Form</h2>
        <p className="text-sm text-gray-600 mb-6">
          Fields marked with * are required. Vehicle photos must be taken before submitting.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select name="status" value={form.status} onChange={handleChange} className="input">
                <option value="">Select Status</option>
                <option value="OUT">OUT</option>
                <option value="IN">IN</option>
              </select>
              {errors.status && (
                <div className="text-red-600 text-sm mt-1">{errors.status}</div>
              )}
            </div>

            <div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Plate *
              </label>
              <input
                name="plate_number"
                value={form.plate_number}
                onChange={handleChange}
                className="input"
                placeholder="e.g., B 1234 ABC"
              />
              {errors.plate_number && (
                <div className="text-red-600 text-sm mt-1">{errors.plate_number}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Odometer (km) *
              </label>
              <input
                name="kilometer"
                value={form.kilometer}
                onChange={handleChange}
                className="input"
                placeholder="Enter kilometers"
                type="number"
              />
              {errors.kilometer && (
                <div className="text-red-600 text-sm mt-1">{errors.kilometer}</div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Condition
              </label>
              <input
                name="fuel_condition"
                value={form.fuel_condition}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Full, 3/4, Half, Low"
              />
            </div>

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
            </div>            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Photos *
              </label>
              {photoUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {photoUrls.map((url, i) => (
                    <div key={i} className="relative">
                      <img 
                        src={url} 
                        alt={`Vehicle photo ${i + 1}`} 
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200" 
                      />
                    </div>
                  ))}
                </div>
              )}              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className={`btn w-full sm:w-auto ${
                  photoUrls.length > 0 ? 'btn-secondary' : 'btn-primary'
                }`}
              >
                {photoUrls.length > 0 ? '📷 Retake Photos' : '📷 Take Photos *'}
              </button>
              {errors.photos && (
                <div className="text-red-600 text-sm mt-1">{errors.photos}</div>
              )}
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
              <h3 className="text-lg font-semibold">Take Vehicle Photos</h3>
              <button
                type="button"
                onClick={() => setShowCamera(false)}
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
