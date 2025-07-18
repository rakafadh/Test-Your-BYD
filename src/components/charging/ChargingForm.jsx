import React, { useState } from 'react';
import { useCharging } from '../../context/ChargingContext';
import CameraCapture from '../CameraCapture';
import { supabase } from '../../utils/supabase';

const initialState = {
  customer_name: '',
  employee_name: '',
  date_time: '',
  police_number: '',
  phone_number: '',
  car_model: '',
  charging_station_type: '',
  front_side_photo: '',
  nomor_rangka_photo: '',
  notes: ''
};

export default function ChargingForm() {
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
  const { chargingRecords, addChargingRecord, fetchChargingRecords, isOnline, offlineQueue, showSuccess, showError } = useCharging();

  function validate() {
    const errs = {};
    if (!form.customer_name) errs.customer_name = 'Wajib diisi';
    if (!form.employee_name) errs.employee_name = 'Wajib diisi';
    if (!form.date_time) errs.date_time = 'Wajib diisi';
    if (!form.police_number) errs.police_number = 'Wajib diisi';
    if (!form.car_model) errs.car_model = 'Wajib diisi';
    if (!form.charging_station_type) errs.charging_station_type = 'Wajib diisi';
    
    // Validate required photos
    if (!form.front_side_photo) errs.front_side_photo = 'Foto sisi depan wajib diambil';
    if (!form.nomor_rangka_photo) errs.nomor_rangka_photo = 'Foto nomor rangka wajib diambil';
    
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
      
      const result = await addChargingRecord(payload);
      if (result.success) {
        if (result.offline) {
          showSuccess('Data saved offline and will sync when online.');
        } else {
          showSuccess('Charging record saved successfully!');
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            New Charging Record
          </h2>
          <p className="text-sm text-gray-600">
            Fields marked with * are required. All photos must be taken before submitting.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Mobile-First Grid Layout */}
          <div className="space-y-4 sm:space-y-6">
            {/* Customer Name - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                className="input tap-target w-full"
                placeholder="Enter customer name"
              />
              {errors.customer_name && (
                <div className="text-red-600 text-sm mt-1">{errors.customer_name}</div>
              )}
            </div>

            {/* Employee Name - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee Name *
              </label>
              <input
                name="employee_name"
                value={form.employee_name}
                onChange={handleChange}
                className="input tap-target w-full"
                placeholder="Enter employee name"
              />
              {errors.employee_name && (
                <div className="text-red-600 text-sm mt-1">{errors.employee_name}</div>
              )}
            </div>

            {/* Two Column Layout for Tablet+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                  className="input tap-target w-full"
                />
                {errors.date_time && (
                  <div className="text-red-600 text-sm mt-1">{errors.date_time}</div>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  className="input tap-target w-full"
                  placeholder="e.g., +62 812 3456 7890"
                />
                {errors.phone_number && (
                  <div className="text-red-600 text-sm mt-1">{errors.phone_number}</div>
                )}
              </div>
            </div>

            {/* Three Column Layout for Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Police Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Police Number *
                </label>
                <input
                  name="police_number"
                  value={form.police_number}
                  onChange={handleChange}
                  className="input tap-target w-full uppercase"
                  placeholder="B 1234 XYZ"
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.police_number && (
                  <div className="text-red-600 text-sm mt-1">{errors.police_number}</div>
                )}
              </div>

              {/* Car Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Model *
                </label>
                <input
                  name="car_model"
                  value={form.car_model}
                  onChange={handleChange}
                  className="input tap-target w-full"
                  placeholder="e.g., Atto 3, Dolphin, Seal, Song Plus, Tang"
                />
                {errors.car_model && (
                  <div className="text-red-600 text-sm mt-1">{errors.car_model}</div>
                )}
              </div>

              {/* Charging Station Type */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Station Type *
                </label>
                <select
                  name="charging_station_type"
                  value={form.charging_station_type}
                  onChange={handleChange}
                  className="input tap-target w-full"
                >
                  <option value="">Select type</option>
                  <option value="AC Charging">AC Charging</option>
                  <option value="DC Charging">DC Charging</option>
                </select>
                {errors.charging_station_type && (
                  <div className="text-red-600 text-sm mt-1">{errors.charging_station_type}</div>
                )}
              </div>
            </div>

            {/* Notes - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="input tap-target w-full resize-none"
                placeholder="Additional notes (optional)"
              />
              {errors.notes && (
                <div className="text-red-600 text-sm mt-1">{errors.notes}</div>
              )}
            </div>
          </div>

          {/* Photo Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo Documentation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Front Side Photo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Front Side Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {form.front_side_photo ? (
                    <div className="space-y-2">
                      <img 
                        src={form.front_side_photo} 
                        alt="Front Side" 
                        className="w-full h-32 object-cover rounded mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => handleTakePhoto('front_side_photo')}
                        className="btn btn-sm bg-green-600 hover:bg-green-700 text-white"
                      >
                        Retake Photo
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTakePhoto('front_side_photo')}
                      className="btn bg-green-600 hover:bg-green-700 text-white"
                    >
                      Take Front Side Photo
                    </button>
                  )}
                </div>
                {errors.front_side_photo && (
                  <div className="text-red-600 text-sm">{errors.front_side_photo}</div>
                )}
              </div>

              {/* Nomor Rangka Photo */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Foto Nomor Rangka *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {form.nomor_rangka_photo ? (
                    <div className="space-y-2">
                      <img 
                        src={form.nomor_rangka_photo} 
                        alt="Nomor Rangka" 
                        className="w-full h-32 object-cover rounded mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => handleTakePhoto('nomor_rangka_photo')}
                        className="btn btn-sm bg-green-600 hover:bg-green-700 text-white"
                      >
                        Retake Photo
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTakePhoto('nomor_rangka_photo')}
                      className="btn bg-green-600 hover:bg-green-700 text-white"
                    >
                      Take Nomor Rangka Photo
                    </button>
                  )}
                </div>
                {errors.nomor_rangka_photo && (
                  <div className="text-red-600 text-sm">{errors.nomor_rangka_photo}</div>
                )}
              </div>

            </div>
          </div>

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
              {submitting ? 'Saving...' : 'Save Charging Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
