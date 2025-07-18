import React from 'react';
import { useCharging } from '../../context/ChargingContext';
import { TrendingUp, Zap, Clock, BarChart3, Battery } from 'lucide-react';

export default function ChargingDashboard() {
  const { chargingRecords, loading, error } = useCharging();

  // Statistics for charging records
  const total = chargingRecords.length;
  const today = new Date().toISOString().split('T')[0];
  
  const todayRecords = chargingRecords.filter(cr => 
    cr.date_time?.startsWith(today)
  ).length;

  const dcCharging = chargingRecords.filter(cr => cr.charging_station_type === 'DC Charging').length;
  const acCharging = chargingRecords.filter(cr => cr.charging_station_type === 'AC Charging').length;

  const stats = [
    {
      title: 'Total Records',
      value: total,
      icon: BarChart3,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Today',
      value: todayRecords,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'AC Charging',
      value: acCharging,
      icon: Battery,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'DC Charging',
      value: dcCharging,
      icon: Zap,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        {loading && (
          <div className="flex items-center gap-2 text-green-600">
            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
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

      {/* Statistics Cards - Mobile Optimized */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow ${stat.bgColor} border-l-4`} 
                 style={{ borderLeftColor: stat.color.includes('blue') ? '#3b82f6' : 
                                           stat.color.includes('green') ? '#10b981' :
                                           stat.color.includes('orange') ? '#f59e0b' : '#8b5cf6' }}>
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
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Charging Activity</h2>
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
                <th className="w-1/6">Station Type</th>
                <th className="w-1/5">Car Model</th>
                <th className="w-1/6">Police #</th>
              </tr>
            </thead>
            <tbody>
              {chargingRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No charging records found
                  </td>
                </tr>
              ) : (
                chargingRecords.slice(0, 5).map((cr) => (
                  <tr key={cr.id}>
                    <td className="font-medium">{cr.customer_name}</td>
                    <td className="text-gray-600">{cr.employee_name}</td>
                    <td className="text-gray-600">
                      <div className="text-xs sm:text-sm">
                        {new Date(cr.date_time).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(cr.date_time).toLocaleTimeString()}
                      </div>
                    </td>
                    <td>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        cr.charging_station_type === 'DC Charging' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {cr.charging_station_type}
                      </span>
                    </td>
                    <td className="text-gray-600">{cr.car_model}</td>
                    <td className="font-mono text-xs">{cr.police_number}</td>
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
