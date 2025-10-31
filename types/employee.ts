export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  salary: number;
  email: string;
  phone: string;
  hireDate: string;
}

export interface EmployeeFormData {
  name: string;
  position: string;
  department: string;
  salary: number;
  email: string;
  phone: string;
  hireDate: string;
}

// Add this for form validation errors
export interface EmployeeFormErrors {
  name?: string;
  position?: string;
  department?: string;
  salary?: string;
  email?: string;
  phone?: string;
  hireDate?: string;
}