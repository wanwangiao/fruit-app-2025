
"use client";

import React, { useState } from 'react';

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (data: any) => void;
  fields: { name: string; label: string; type: string; placeholder?: string; initialValue?: any; disabled?: boolean; }[];
  submitText?: string;
}

export default function InputModal({
  isOpen,
  onClose,
  title,
  onSubmit,
  fields,
  submitText = '提交',
}: InputModalProps) {
  const [formData, setFormData] = useState(() => {
    const initialData: { [key: string]: any } = {};
    fields.forEach(field => {
      initialData[field.name] = field.initialValue !== undefined ? field.initialValue : '';
    });
    return initialData;
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === 'checkbox' && target instanceof HTMLInputElement ? target.checked : target.value;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose(); // 提交後關閉模態框
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-1/3 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {fields.map(field => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900"
                required={field.type !== 'checkbox'} // 簡單的必填判斷
              />
            </div>
          ))}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              取消
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
