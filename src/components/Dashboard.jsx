import React, { useState } from 'react';
import { useTestDrive } from '../context/TestDriveContext';
import { TrendingUp, TrendingDown, Clock, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const { testDrives, loading, error } = useTestDrive();

  // Simple statistics
  const totalOut = testDrives.filter(td => td.status === 'OUT').length;
  const totalIn = testDrives.filter(td => td.status === 'IN').length;
  const pending = totalOut - totalIn;
  const total = testDrives.length;

  const stats = [
    {
      title: 'Total OUT',
      value: totalOut,
      icon: TrendingUp,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total IN',
      value: totalIn,
      icon: TrendingDown,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending',
      value: pending,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Total Records',
      value: total,
      icon: BarChart3,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];
  return (
    <div className="space-y-6 mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        {loading && (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading data...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 font-medium">Error loading data</div>
          <div className="text-red-600 text-sm mt-1">{error}</div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`card ${stat.bgColor} border-l-4 ${stat.color.replace('bg-', 'border-')}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.title}</div>
                </div>
                <div className={`p-2 sm:p-3 rounded-full ${stat.color}`}>
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Activity</h2>
          <div className="text-xs sm:text-sm text-gray-500">
            Showing latest 5 records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="w-1/4">Employee</th>
                <th className="w-1/4">Date & Time</th>
                <th className="w-1/6">Status</th>
                <th className="w-1/4">Car Model</th>
                <th className="w-1/6">Plate</th>
              </tr>
            </thead>
            <tbody>
              {testDrives.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No test drive records found
                  </td>
                </tr>
              ) : (
                testDrives.slice(0, 5).map((td) => (
                  <tr key={td.id}>
                    <td className="font-medium">{td.employee_name}</td>
                    <td className="text-gray-600">
                      <div className="text-xs sm:text-sm">
                        {new Date(td.date_time).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(td.date_time).toLocaleTimeString()}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          td.status === 'OUT'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {td.status}
                      </span>
                    </td>
                    <td className="text-gray-600">{td.car_model}</td>
                    <td className="font-mono text-sm">{td.plate_number}</td>
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
