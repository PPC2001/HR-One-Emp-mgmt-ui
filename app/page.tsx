'use client';

import { useState, useEffect } from 'react';
import { Employee, EmployeeFormData } from '@/types/employee';
import { employeeService } from '@/services/employeeService';
import EmployeeForm from '@/components/EmployeeForm';
import EmployeeList from '@/components/EmployeeList';

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      showNotification('error', 'Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateEmployee = async (formData: EmployeeFormData) => {
    setIsLoading(true);
    try {
      await employeeService.createEmployee(formData);
      await loadEmployees();
      setShowForm(false);
      showNotification('success', 'Employee created successfully!');
    } catch (error) {
      showNotification('error', 'Failed to create employee');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmployee = async (formData: EmployeeFormData) => {
    if (!editingEmployee) return;

    setIsLoading(true);
    try {
      await employeeService.updateEmployee(editingEmployee.id, formData);
      await loadEmployees();
      setEditingEmployee(null);
      setShowForm(false);
      showNotification('success', 'Employee updated successfully!');
    } catch (error) {
      showNotification('error', 'Failed to update employee');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    setIsLoading(true);
    try {
      await employeeService.deleteEmployee(id);
      await loadEmployees();
      showNotification('success', 'Employee deleted successfully!');
    } catch (error) {
      showNotification('error', 'Failed to delete employee');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setEditingEmployee(null);
    setShowForm(false);
  };

  const handleSubmitForm = (formData: EmployeeFormData) => {
    if (editingEmployee) {
      handleUpdateEmployee(formData);
    } else {
      handleCreateEmployee(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your employee records with ease
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-4 p-4 rounded-md ${
              notification.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Action Bar */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Employees ({employees.length})
            </h2>
          </div>
          <button
            onClick={() => setShowForm(true)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add New Employee
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Employee List */}
          <div className={`lg:col-span-${showForm ? '2' : '3'}`}>
            <EmployeeList
              employees={employees}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
              isLoading={isLoading}
            />
          </div>

          {/* Employee Form */}
          {showForm && (
            <div className="lg:col-span-1">
              <EmployeeForm
                employee={editingEmployee}
                onSubmit={handleSubmitForm}
                onCancel={handleCancelForm}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}