// Task types and interfaces
export interface Task {
  id: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  deadline: string;
  status: 'Active' | 'Completed' | 'Expired';
  createdAt: string;
}

export interface TaskFormData {
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  deadline: string;
}

export type TaskStatus = 'Active' | 'Completed' | 'Expired';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type SortBy = 'priority' | 'deadline' | 'status' | 'title';
export type FilterBy = 'all' | TaskStatus;