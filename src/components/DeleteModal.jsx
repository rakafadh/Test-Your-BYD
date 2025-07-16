import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Record", 
  message = "Are you sure you want to delete this record?",
  item = null,
  isLoading = false 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>

        {item && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border">
            <div className="text-sm space-y-1">
              <div><strong>Employee:</strong> {item.employee_name}</div>
              <div><strong>Date:</strong> {new Date(item.date_time).toLocaleString()}</div>
              <div><strong>Plate:</strong> {item.plate_number}</div>
              <div><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  item.status === 'OUT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="btn btn-secondary flex-1"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-red-600 hover:bg-red-700 text-white flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <Trash2 className="w-4 h-4" />
                Delete
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
