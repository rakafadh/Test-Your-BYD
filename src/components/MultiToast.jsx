import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { useTestDrive } from '../context/TestDriveContext';
import { useCharging } from '../context/ChargingContext';

export default function MultiToast() {
  // Get toast states from both contexts
  const testDriveContext = useTestDrive();
  const chargingContext = useCharging();
  
  // Determine which toast to show (prioritize the one that's active)
  let activeToast = null;
  let hideToast = null;
  
  if (testDriveContext?.toast?.show) {
    activeToast = testDriveContext.toast;
    hideToast = testDriveContext.hideToast;
  } else if (chargingContext?.toast?.show) {
    activeToast = chargingContext.toast;
    hideToast = chargingContext.hideToast;
  }

  if (!activeToast?.show) return null;

  const isSuccess = activeToast.type === 'success';
  const Icon = isSuccess ? CheckCircle : XCircle;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden transition-all duration-300 ${
        isSuccess 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon className={`h-5 w-5 ${
                isSuccess ? 'text-green-400' : 'text-red-400'
              }`} />
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className={`text-sm font-medium ${
                isSuccess ? 'text-green-800' : 'text-red-800'
              }`}>
                {activeToast.message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={hideToast}
                className={`rounded-md inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isSuccess 
                    ? 'text-green-400 hover:text-green-600 focus:ring-green-500' 
                    : 'text-red-400 hover:text-red-600 focus:ring-red-500'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
