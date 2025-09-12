import { Task } from '../types/task';





export function getTaskStatusClass(task: Task): string {
	switch (task.status) {
		case 'Completed':
			return 'task-completed';
		case 'Expired':
			return 'task-expired';
		default:
			return 'task-active';
	}
}

export function getPriorityColor(task: Task): string {
	switch (task.priority) {
		case 'High':
			return '#ff4757';
		case 'Medium':
			return '#ffa502';
		case 'Low':
			return '#2ed573';
		default:
			return '#747d8c';
	}

}

export function getFilteredTasks(tasks: Task[], filterBy: string, sortBy: string): Task[] {
	let filtered = tasks;
	if (filterBy !== 'all') {
		filtered = filtered.filter(task => task.status === filterBy);
	}
	filtered = [...filtered].sort((a, b) => {
		switch (sortBy) {
			case 'priority':
				const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
				return priorityOrder[b.priority] - priorityOrder[a.priority];

			case 'deadline':
				return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();

			case 'status':
				const statusOrder = { 'Expired': 3, 'Active': 2, 'Completed': 1 };
				return statusOrder[b.status] - statusOrder[a.status];

			case 'title':
				return a.title.localeCompare(b.title);

			default:
				return 0;
		}
	});
	return filtered;
};


