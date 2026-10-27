import React from 'react';

export const Badge = ({ status = 'default', children, className = '' }) => {
  const normalized = String(status).toUpperCase();

  let style = 'bg-slate-100 text-slate-800 border-slate-200';

  if (['PAID', 'DELIVERED', 'COMPLETED', 'ACTIVE', 'IN STOCK'].includes(normalized)) {
    style = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (['PENDING', 'PENDING_PAYMENT'].includes(normalized)) {
    style = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (['CANCELLED', 'PAYMENT_FAILED', 'INACTIVE', 'OUT OF STOCK'].includes(normalized)) {
    style = 'bg-rose-50 text-rose-800 border-rose-200';
  } else if (['FULFILLED', 'SHIPPED'].includes(normalized)) {
    style = 'bg-blue-50 text-blue-800 border-blue-200';
  } else if (['ADMIN'].includes(normalized)) {
    style = 'bg-purple-50 text-purple-800 border-purple-200 font-bold';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style} ${className}`}>
      {children || status}
    </span>
  );
};

export default Badge;
