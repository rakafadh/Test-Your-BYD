import React from 'react';

export const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="card p-0">
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th><div className="h-4 bg-gray-200 rounded w-20"></div></th>
            <th><div className="h-4 bg-gray-200 rounded w-24"></div></th>
            <th><div className="h-4 bg-gray-200 rounded w-16"></div></th>
            <th><div className="h-4 bg-gray-200 rounded w-20"></div></th>
            <th><div className="h-4 bg-gray-200 rounded w-16"></div></th>
          </tr>
        </thead>
        <tbody className="animate-pulse">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              <td><div className="h-4 bg-gray-200 rounded w-full"></div></td>
              <td><div className="h-4 bg-gray-200 rounded w-full"></div></td>
              <td><div className="h-4 bg-gray-200 rounded w-full"></div></td>
              <td><div className="h-4 bg-gray-200 rounded w-full"></div></td>
              <td><div className="h-4 bg-gray-200 rounded w-full"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const SkeletonForm = () => (
  <div className="card animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={i === 0 ? 'sm:col-span-2' : ''}>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
      <div className="h-10 bg-gray-200 rounded w-32"></div>
    </div>
  </div>
);

export default { SkeletonCard, SkeletonTable, SkeletonForm };
