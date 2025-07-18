import React from 'react';
import { useTestDrive } from '../../context/TestDriveContext';
import { Car, TrendingUp, Clock, BarChart3, AlertCircle } from 'lucide-react';

export default function TestDriveDashboard() {
  const { testDrives, isLoading, isOffline } = useTestDrive();

  // Statistics for test drive records
  const total = testDrives.length;
  const totalOut = testDrives.filter(td => td.status === 'OUT').length;
  const totalIn = testDrives.filter(td => td.status === 'IN').length;
  const pending = totalOut; // Cars that are still OUT

  const stats = [
    {
      title: 'Total OUT',
      value: totalOut,
      icon: Car,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Total IN',
      value: totalIn,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending',
      value: pending,
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Total Records',
      value: total,
      icon: BarChart3,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        {isLoading && (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading data...</span>
          </div>
        )}
        {isOffline && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Offline Mode</span>
          </div>
        )}
      </div>

      {/* Statistics Cards - Mobile Optimized */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow ${stat.bgColor} border-l-4`} 
                 style={{ borderLeftColor: stat.color.includes('red') ? '#ef4444' : 
                                           stat.color.includes('green') ? '#10b981' :
                                           stat.color.includes('orange') ? '#f59e0b' : '#3b82f6' }}>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium mt-1 leading-tight">
                    {stat.title}
                  </div>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg ${stat.color} flex-shrink-0 ml-2`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Test Drive Activity</h2>
          <div className="text-xs sm:text-sm text-gray-500">
            Showing latest 5 records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="w-1/5">Customer</th>
                <th className="w-1/5">Employee</th>
                <th className="w-1/5">Date & Time</th>
                <th className="w-1/6">Status</th>
                <th className="w-1/5">Car Model</th>
                <th className="w-1/6">Police #</th>
              </tr>
            </thead>
            <tbody>
              {testDrives.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No test drive records found
                  </td>
                </tr>
              ) : (
                testDrives.slice(0, 5).map((td) => (
                  <tr key={td.id}>
                    <td className="font-medium">{td.customer_name}</td>
                    <td className="text-gray-600">{td.employee_name}</td>
                    <td className="text-gray-600">
                      <div className="text-xs sm:text-sm">
                        {new Date(td.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(td.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        td.status === 'OUT' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {td.status}
                      </span>
                    </td>
                    <td className="text-gray-600">{td.car_model}</td>
                    <td className="font-mono text-xs">{td.police_number}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
