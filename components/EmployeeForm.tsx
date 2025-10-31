'use client';

import { useState, useEffect } from 'react';
import { Employee, EmployeeFormData } from '@/types/employee';

interface EmployeeFormProps {
  employee?: Employee | null;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  name?: string;
  position?: string;
  department?: string;
  salary?: string;
  email?: string;
  phone?: string;
  hireDate?: string;
}

export default function EmployeeForm({ 
  employee, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: EmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    position: '',
    department: '',
    salary: 0,
    email: '',
    phone: '',
    hireDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        position: employee.position,
        department: employee.department,
        salary: employee.salary,
        email: employee.email,
        phone: employee.phone,
        hireDate: employee.hireDate,
      });
    }
  }, [employee]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (formData.salary <= 0) newErrors.salary = 'Salary must be greater than 0';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? (value === '' ? 0 : Number(value)) : value,
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded border border-gray-200 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {employee ? 'Edit Employee' : 'Add New Employee'}
      </h3>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full rounded border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position *
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={`w-full rounded border ${
              errors.position ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.position && <p className="mt-1 text-xs text-red-600">{errors.position}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department *
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`w-full rounded border ${
              errors.department ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
          {errors.department && <p className="mt-1 text-xs text-red-600">{errors.department}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Salary *
          </label>
          <input
            type="number"
            name="salary"
            min="0"
            value={formData.salary || ''}
            onChange={handleChange}
            className={`w-full rounded border ${
              errors.salary ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.salary && <p className="mt-1 text-xs text-red-600">{errors.salary}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full rounded border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full rounded border ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hire Date *
          </label>
          <input
            type="date"
            name="hireDate"
            value={formData.hireDate}
            onChange={handleChange}
            className={`w-full rounded border ${
              errors.hireDate ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.hireDate && <p className="mt-1 text-xs text-red-600">{errors.hireDate}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : employee ? 'Update' : 'Add Employee'}
        </button>
      </div>
    </form>
  );
}