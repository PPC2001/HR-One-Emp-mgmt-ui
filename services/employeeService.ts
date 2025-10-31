'use client';

import { Employee, EmployeeFormData } from '@/types/employee';

/**
 * Employee Service — client-side only (browser safe)
 * Uses internal /api/employees routes which handle auth securely on the server.
 */

export const employeeService = {
  async getAllEmployees(): Promise<Employee[]> {
    const response = await fetch('/api/employees', { method: 'GET' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  async createEmployee(employeeData: EmployeeFormData): Promise<Employee> {
    const response = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  async updateEmployee(id: string, employeeData: EmployeeFormData): Promise<Employee> {
    const response = await fetch(`/api/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  async deleteEmployee(id: string): Promise<void> {
    const response = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  },
};
