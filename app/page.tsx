'use client';

import { useState, useEffect } from 'react';
import EmployeeList from '@/components/EmployeeList';
import EmployeeForm from '@/components/EmployeeForm';
import { employeeService } from '@/services/employeeService';
import { Employee, EmployeeFormData } from '@/types/employee';
import { useUser } from '@auth0/nextjs-auth0/client';
import LandingPage from '@/components/LandingPage';
import Link from 'next/link';

export default function HomePage() {
  const { user, isLoading } = useUser();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadEmployees();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeService.getAllEmployees();
      setEmployees(data || []);
    } catch (error) {
      console.error('Failed to load employees:', error);
      setError('Failed to load employees. Please try again.');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (formData: EmployeeFormData) => {
    try {
      await employeeService.createEmployee(formData);
      await loadEmployees();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create employee:', error);
      setError('Failed to create employee. Please try again.');
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleUpdateEmployee = async (formData: EmployeeFormData) => {
    if (!editingEmployee) return;
    
    try {
      await employeeService.updateEmployee(editingEmployee.id, formData);
      await loadEmployees();
      setEditingEmployee(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to update employee:', error);
      setError('Failed to update employee. Please try again.');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      await employeeService.deleteEmployee(id);
      await loadEmployees();
    } catch (error) {
      console.error('Failed to delete employee:', error);
      setError('Failed to delete employee. Please try again.');
    }
  };

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, show landing page
  if (!user) {
    return <LandingPage />;
  }

  // If authenticated, show the main app
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">HR</span>
                </div>
                <span className="text-xl font-bold text-gray-900">HR One</span>
              </div>
            </div>

            {/* Right side - User info and Logout */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
                <span className="text-xs text-gray-500">
                  {user.email}
                </span>
              </div>
              <Link 
                href="/api/auth/logout"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="space-y-6">
            {/* Welcome Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                Welcome back, <strong>{user.name}</strong>! 👋 Ready to manage your team?
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm font-medium">{error}</p>
                <button 
                  onClick={loadEmployees}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium mt-2"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Compact Header Section */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Employee Dashboard
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Managing {employees.length} employees across {new Set(employees.map(emp => emp.department)).size} departments
                </p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Employee
              </button>
            </div>

            {/* Compact Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{employees.length}</div>
                    <div className="text-sm text-gray-600">Total Employees</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {employees.length > 0 
                        ? `$${Math.round(employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length).toLocaleString()}`
                        : '$0'
                      }
                    </div>
                    <div className="text-sm text-gray-600">Average Salary</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-purple-100 mr-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {employees.length > 0 
                        ? `$${Math.max(...employees.map(emp => emp.salary)).toLocaleString()}`
                        : '$0'
                      }
                    </div>
                    <div className="text-sm text-gray-600">Highest Salary</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-orange-100 mr-3">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {new Set(employees.map(emp => emp.department)).size}
                    </div>
                    <div className="text-sm text-gray-600">Departments</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form and Table */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Employee Form - Only show when needed */}
              {showForm && (
                <div className="lg:col-span-1">
                  <EmployeeForm
                    employee={editingEmployee}
                    onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingEmployee(null);
                    }}
                  />
                </div>
              )}
              
              {/* Employee Table - Adjust width based on form visibility */}
              <div className={showForm ? "lg:col-span-3" : "lg:col-span-4"}>
                <EmployeeList
                  employees={employees}
                  onEdit={handleEditEmployee}
                  onDelete={handleDeleteEmployee}
                  isLoading={loading}
                  // onRefresh={loadEmployees}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}