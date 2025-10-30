import { Employee, EmployeeFormData } from '@/types/employee';

// In a real app, this would be your API service
class EmployeeService {
  private employees: Employee[] = [];
  private nextId = 1;

  // Create
  async createEmployee(data: EmployeeFormData): Promise<Employee> {
    const newEmployee: Employee = {
      ...data,
      id: this.nextId.toString(),
    };
    this.employees.push(newEmployee);
    this.nextId++;
    return newEmployee;
  }

  // Read all
  async getAllEmployees(): Promise<Employee[]> {
    return [...this.employees];
  }

  // Read single
  async getEmployeeById(id: string): Promise<Employee | null> {
    return this.employees.find(emp => emp.id === id) || null;
  }

  // Update
  async updateEmployee(id: string, data: EmployeeFormData): Promise<Employee | null> {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) return null;

    this.employees[index] = { ...data, id };
    return this.employees[index];
  }

  // Delete
  async deleteEmployee(id: string): Promise<boolean> {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) return false;

    this.employees.splice(index, 1);
    return true;
  }
}

export const employeeService = new EmployeeService();