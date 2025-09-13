import { Task } from '../types/task';
import {
	SaveLocalTask,
	GetLocalTasks,
	DeleteLocalTask,
	UpdateLocalTaskStatus,
	AddPostgresTask,
	GetPostgresTasks,
	DeletePostgresTask,
	UpdatePostgresTaskStatus,
	GetPostgresConfig
} from "../../wailsjs/go/app/App";

interface TaskPayload {
	id: number;
	title: string;
	deadline: string;
	status: string;
	priority: string;
	created_at: string;
}

async function isPostgresAvailable(): Promise<boolean> {
	try {
		const config = await GetPostgresConfig();
		return !!(config && config.host && config.dbName);
	} catch (error) {
		return false;
	}
}


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

export async function addTask(task: TaskPayload): Promise<number | void> {
	try {
		await SaveLocalTask(task);
		console.log("Task saved to local storage successfully.");

		const postgresAvailable = await isPostgresAvailable();
		if (postgresAvailable) {
			const postgresTaskId = await AddPostgresTask(task);
			console.log("Task also saved to PostgreSQL with ID:", postgresTaskId);
			return postgresTaskId;
		}
	} catch (error) {
		console.error("Error saving task:", error);
		throw error;
	}
}

export async function getTasks(): Promise<TaskPayload[]> {
	try {
		// Check if PostgreSQL is available and prefer it
		const postgresAvailable = await isPostgresAvailable();
		if (postgresAvailable) {
			try {
				const postgresTasks = await GetPostgresTasks();
				console.log("Tasks fetched from PostgreSQL");
				return postgresTasks || [];
			} catch (postgresError) {
				console.warn("Failed to fetch from PostgreSQL, falling back to local:", postgresError);
			}
		}

		// Fall back to local storage
		const localTasks = await GetLocalTasks();
		console.log("Tasks fetched from local storage");
		return localTasks || [];
	} catch (error) {
		console.error("Error fetching tasks:", error);
		return [];
	}
}

export async function deleteTask(taskId: number) {
	try {
		// Delete from local storage
		await DeleteLocalTask(taskId);
		console.log("Task deleted from local storage successfully.");

		// Check if PostgreSQL is available and delete from there too
		const postgresAvailable = await isPostgresAvailable();
		if (postgresAvailable) {
			try {
				await DeletePostgresTask(taskId);
				console.log("Task also deleted from PostgreSQL.");
			} catch (postgresError) {
				console.warn("Failed to delete from PostgreSQL:", postgresError);
			}
		}
	} catch (error) {
		console.error("Error deleting task:", error);
		throw error;
	}
}

export async function updateTaskStatus(taskId: number, newStatus: string) {
	try {
		// Update in local storage
		await UpdateLocalTaskStatus(taskId, newStatus);
		console.log("Task status updated in local storage successfully.");

		// Check if PostgreSQL is available and update there too
		const postgresAvailable = await isPostgresAvailable();
		if (postgresAvailable) {
			try {
				await UpdatePostgresTaskStatus(taskId, newStatus);
				console.log("Task status also updated in PostgreSQL.");
			} catch (postgresError) {
				console.warn("Failed to update status in PostgreSQL:", postgresError);
			}
		}
	} catch (error) {
		console.error("Error updating task status:", error);
		throw error;
	}
}

