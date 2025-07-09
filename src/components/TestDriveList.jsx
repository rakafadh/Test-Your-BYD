import React, { useState } from 'react';
import { useTestDrive } from '../context/TestDriveContext';
import { Download, Search, Filter, Calendar, User } from 'lucide-react';

function exportToCSV(data) {
  const replacer = (key, value) => value === null ? '' : value;
  const header = [
    'Employee Name', 'Date & Time', 'Status', 'Car Model', 'License Plate', 'Odometer', 'Fuel Condition', 'Notes', 'Photos'
  ];
  const rows = data.map(td => [
    td.employee_name,
    new Date(td.date_time).toLocaleString(),
    td.status,
    td.car_model,
    td.plate_number,
    td.kilometer,
    td.fuel_condition,
    td.notes,
    (td.photos||[]).join('; ')
  ]);
  let csv = [header, ...rows].map(e => e.map(a => `"${a}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `testdrive_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function TestDriveList() {
  const { testDrives, loading, error } = useTestDrive();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [employee, setEmployee] = useState('');

  const filtered = testDrives.filter(td => {
    return (
      (!search || td.plate_number.toLowerCase().includes(search.toLowerCase())) &&
      (!status || td.status === status) &&
      (!date || td.date_time.startsWith(date)) &&
      (!employee || td.employee_name.toLowerCase().includes(employee.toLowerCase()))
    );
  });
  return (
    <div className="space-y-6 mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Test Drive Records</h2>
        <button
          onClick={() => exportToCSV(filtered)}
          className="btn btn-success flex items-center gap-2"
          disabled={filtered.length === 0}
        >
          <Download className="w-4 h-4" />
          Export CSV ({filtered.length})
        </button>
      </div>      {/* Filters */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 sm:hidden">License Plate</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <input
                placeholder="Search license plate..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-10 pr-3"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 sm:hidden">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="input pl-10 pr-3"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 sm:hidden">Employee</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <input
                placeholder="Employee name..."
                value={employee}
                onChange={e => setEmployee(e.target.value)}
                className="input pl-10 pr-3"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 sm:hidden">Status</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <select value={status} onChange={e => setStatus(e.target.value)} className="input pl-10 pr-8 appearance-none bg-white">
                <option value="">All Status</option>
                <option value="OUT">OUT</option>
                <option value="IN">IN</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {(search || status || date || employee) && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing {filtered.length} of {testDrives.length} records
            </span>
            <button
              onClick={() => {
                setSearch('');
                setStatus('');
                setDate('');
                setEmployee('');
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading records...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 font-medium">Error loading records</div>
          <div className="text-red-600 text-sm mt-1">{error}</div>
        </div>
      )}

      {/* Table */}
      <div className="card p-0">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="sticky left-0 bg-gray-50 z-10">Employee</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Car Model</th>
                <th>License Plate</th>
                <th>Odometer</th>
                <th>Photos</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    {testDrives.length === 0 ? 'No test drive records found' : 'No records match your filters'}
                  </td>
                </tr>
              ) : (
                filtered.map((td) => (
                  <tr key={td.id} className="group">
                    <td className="sticky left-0 bg-white group-hover:bg-gray-50 font-medium z-10">
                      {td.employee_name}
                    </td>
                    <td className="text-gray-600">
                      <div className="text-sm">
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
                    <td className="text-gray-600">{td.kilometer} km</td>
                    <td>
                      {td.photos && td.photos.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {td.photos.slice(0, 3).map((url, i) => (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              key={i}
                              className="block hover:opacity-75 transition-opacity"
                            >
                              <img
                                src={url}
                                alt={`Vehicle photo ${i + 1}`}
                                className="w-12 h-8 object-cover rounded border"
                              />
                            </a>
                          ))}
                          {td.photos.length > 3 && (
                            <div className="w-12 h-8 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-600">
                              +{td.photos.length - 3}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No photos</span>
                      )}
                    </td>
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
