import React, { useState } from 'react';
import { useTestDrive } from '../context/TestDriveContext';
import { Download, Search, Filter, Calendar, User, Trash2, CheckSquare, Square } from 'lucide-react';
import DeleteModal from './DeleteModal';

function exportToCSV(data) {
  const replacer = (key, value) => value === null ? '' : value;
  const header = [
    'Customer Name', 'Employee Name', 'Date & Time', 'Police Number', 'Car Model', 'Notes', 
    'Front Photo', 'Back Photo', 'Left Photo', 'Right Photo', 'Mid Photo', 'Form Photo'
  ];
  const rows = data.map(td => [
    td.customer_name,
    td.employee_name,
    new Date(td.date_time).toLocaleString(),
    td.police_number,
    td.car_model,
    td.notes,
    td.front_photo || '',
    td.back_photo || '',
    td.left_photo || '',
    td.right_photo || '',
    td.mid_photo || '',
    td.form_photo || ''
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
  const { testDrives, loading, error, deleteTestDrive, deleteMultipleTestDrives, showSuccess, showError, isOnline } = useTestDrive();
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [employee, setEmployee] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = testDrives.filter(td => {
    return (
      (!search || td.police_number.toLowerCase().includes(search.toLowerCase())) &&
      (!date || td.date_time.startsWith(date)) &&
      (!employee || td.employee_name.toLowerCase().includes(employee.toLowerCase()))
    );
  });
  
  // Selection handlers
  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filtered.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filtered.map(td => td.id)));
    }
  };

  // Delete handlers
  const handleDeleteSingle = async () => {
    setDeleting(true);
    try {
      await deleteTestDrive(deleteModal.item.id);
      showSuccess('Record deleted successfully');
      setDeleteModal({ isOpen: false, item: null });
      setSelectedItems(new Set());
    } catch (err) {
      showError('Failed to delete record: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteMultipleTestDrives(Array.from(selectedItems));
      showSuccess(`Successfully deleted ${result.count} records`);
      setBulkDeleteModal(false);
      setSelectedItems(new Set());
    } catch (err) {
      showError('Failed to delete records: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Test Drive Records</h2>
          {selectedItems.size > 0 && (
            <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {selectedItems.size} selected
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {selectedItems.size > 0 && (
            <button
              onClick={() => setBulkDeleteModal(true)}
              className="btn bg-red-600 hover:bg-red-700 text-white text-sm"
              disabled={!isOnline}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete Selected
            </button>
          )}
          <button
            onClick={() => exportToCSV(filtered)}
            className="btn btn-success flex items-center gap-2"
            disabled={filtered.length === 0}
          >
            <Download className="w-4 h-4" />
            Export CSV ({filtered.length})
          </button>
        </div>
      </div>      {/* Filters */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 sm:hidden">License Plate</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <input
                placeholder="Search police number..."
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

          </div>
        </div>
        
        {(search || date || employee) && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing {filtered.length} of {testDrives.length} records
            </span>
            <button
              onClick={() => {
                setSearch('');
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
                <th className="sticky left-0 bg-gray-50 z-10">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === filtered.length && filtered.length > 0}
                      onChange={handleSelectAll}
                      className="checkbox checkbox-sm"
                    />
                    Customer
                  </div>
                </th>
                <th>Employee</th>
                <th>Date & Time</th>
                <th>Police Number</th>
                <th>Car Model</th>
                <th>Photos</th>
                <th className="text-right pr-4">Actions</th>
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
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(td.id)}
                          onChange={() => handleSelectItem(td.id)}
                          className="checkbox checkbox-sm"
                        />
                        {td.customer_name}
                      </div>
                    </td>
                    <td className="text-gray-600">{td.employee_name}</td>
                    <td className="text-gray-600">
                      <div className="text-sm">
                        {new Date(td.date_time).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(td.date_time).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="font-mono text-sm">{td.police_number}</td>
                    <td className="text-gray-600">{td.car_model}</td>
                    <td>
                      {/* Display available photos */}
                      <div className="flex gap-1 flex-wrap">
                        {[
                          { url: td.front_photo, label: 'F' },
                          { url: td.back_photo, label: 'B' },
                          { url: td.left_photo, label: 'L' },
                          { url: td.right_photo, label: 'R' },
                          { url: td.mid_photo, label: 'M' },
                          { url: td.form_photo, label: 'Form' }
                        ].filter(photo => photo.url).map((photo, i) => (
                          <a
                            href={photo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={i}
                            className="block hover:opacity-75 transition-opacity"
                            title={`${photo.label} photo`}
                          >
                            <img
                              src={photo.url}
                              alt={`${photo.label} photo`}
                              className="w-8 h-6 object-cover rounded border"
                            />
                          </a>
                        ))}
                        {[td.front_photo, td.back_photo, td.left_photo, td.right_photo, td.mid_photo, td.form_photo].filter(Boolean).length === 0 && (
                          <span className="text-gray-400 text-sm">No photos</span>
                        )}
                      </div>
                    </td>
                    <td className="text-right pr-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, item: td })}
                          className="text-red-600 hover:text-red-800"
                          disabled={!isOnline}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modals */}
      <>
        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, item: null })}
          onConfirm={handleDeleteSingle}
          title="Delete Test Drive Record"
          message="This action cannot be undone."
          item={deleteModal.item}
          isLoading={deleting}
        />
        
        <DeleteModal
          isOpen={bulkDeleteModal}
          onClose={() => setBulkDeleteModal(false)}
          onConfirm={handleBulkDelete}
          title={`Delete ${selectedItems.size} Records`}
          message={`Are you sure you want to delete ${selectedItems.size} selected records? This action cannot be undone.`}
          isLoading={deleting}
        />
      </>
    </div>
  );
}
