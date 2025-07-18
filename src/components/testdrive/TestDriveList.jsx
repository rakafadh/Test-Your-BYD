import React, { useState } from 'react';
import { useTestDrive } from '../../context/TestDriveContext';
import { Download, Search, Calendar, User, Trash2 } from 'lucide-react';
import DeleteModal from '../DeleteModal';

function exportToExcel(data) {
  const header = [
    'ID', 'Customer Name', 'Employee Name', 'Date & Time', 'Police Number', 'Car Model', 
    'Status', 'Notes', 'Front Photo', 'Back Photo', 'Left Photo', 'Right Photo', 
    'Mid Photo', 'Form Photo', 'Created At'
  ];
  const rows = data.map(td => [
    td.id || '',
    td.customer_name || '',
    td.employee_name || '',
    td.date_time ? new Date(td.date_time).toLocaleString() : '',
    td.police_number || '',
    td.car_model || '',
    td.status || '',
    td.notes || '',
    td.front_photo || '',
    td.back_photo || '',
    td.left_photo || '',
    td.right_photo || '',
    td.mid_photo || '',
    td.form_photo || '',
    td.created_at ? new Date(td.created_at).toLocaleString() : ''
  ]);
  let csv = [header, ...rows].map(e => e.map(a => `"${a}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `test_drive_records_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function TestDriveList() {
  const { testDrives, loading, error, deleteTestDrive, deleteMultipleTestDrives, showSuccess, showError, isOnline } = useTestDrive();
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [employee, setEmployee] = useState('');
  const [status, setStatus] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = testDrives.filter(td => {
    return (
      (!search || td.police_number?.toLowerCase().includes(search.toLowerCase())) &&
      (!date || td.date_time?.startsWith(date)) &&
      (!employee || td.employee_name?.toLowerCase().includes(employee.toLowerCase())) &&
      (!status || td.status === status)
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
      const idsArray = Array.from(selectedItems);
      await deleteMultipleTestDrives(idsArray);
      showSuccess(`${idsArray.length} records deleted successfully`);
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
      {/* Header - Mobile First */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Test Drive Records</h2>
            {selectedItems.size > 0 && (
              <div className="text-xs sm:text-sm text-gray-600 bg-green-50 px-2 sm:px-3 py-1 rounded-full border border-green-200">
                {selectedItems.size} selected
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {selectedItems.size > 0 && (
            <button
              onClick={() => setBulkDeleteModal(true)}
              className="btn bg-red-600 hover:bg-red-700 text-white text-sm tap-target"
              disabled={!isOnline}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              <span>Delete Selected</span>
            </button>
          )}
          <button
            onClick={() => exportToExcel(filtered)}
            className="btn btn-success flex items-center justify-center gap-2 tap-target"
            disabled={filtered.length === 0}
          >
            <Download className="w-4 h-4" />
            <span>Export Excel ({filtered.length})</span>
          </button>
        </div>
      </div>

      {/* Filters - Mobile Optimized */}
      <div className="card">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1 sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 sm:hidden">Police Number</label>
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
                placeholder="Search employee..."
                value={employee}
                onChange={e => setEmployee(e.target.value)}
                className="input pl-10 pr-3"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 sm:hidden">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="input"
            >
              <option value="">All Status</option>
              <option value="OUT">OUT</option>
              <option value="IN">IN</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>
        </div>
        
        {(search || date || employee || status) && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing {filtered.length} of {testDrives.length} records
            </span>
            <button
              onClick={() => {
                setSearch('');
                setDate('');
                setEmployee('');
                setStatus('');
              }}
              className="text-sm text-green-600 hover:text-green-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
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
                <th>Status</th>
                <th>Police Number</th>
                <th>Car Model</th>
                <th>Photos</th>
                <th className="text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">
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
                    <td>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        td.status === 'OUT' 
                          ? 'bg-blue-100 text-blue-800' 
                          : td.status === 'IN'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {td.status}
                      </span>
                    </td>
                    <td className="font-mono text-sm">{td.police_number}</td>
                    <td className="text-gray-600">{td.car_model}</td>
                    <td>
                      <div className="flex gap-1 flex-wrap">
                        {[
                          { url: td.front_photo, label: 'Front' },
                          { url: td.back_photo, label: 'Back' },
                          { url: td.left_photo, label: 'Left' },
                          { url: td.right_photo, label: 'Right' },
                          { url: td.mid_photo, label: 'Mid' },
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
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, item: td })}
                        className="btn btn-sm bg-red-600 hover:bg-red-700 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={!isOnline}
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modals */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDeleteSingle}
        loading={deleting}
        title="Delete Test Drive Record"
        message={`Are you sure you want to delete the test drive record for ${deleteModal.item?.customer_name}?`}
      />

      <DeleteModal
        isOpen={bulkDeleteModal}
        onClose={() => setBulkDeleteModal(false)}
        onConfirm={handleBulkDelete}
        loading={deleting}
        title="Delete Multiple Records"
        message={`Are you sure you want to delete ${selectedItems.size} test drive records?`}
      />
    </div>
  );
}

export default TestDriveList;
