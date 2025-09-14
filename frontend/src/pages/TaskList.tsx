import { useState, useEffect } from 'react';
import { Task, TaskFormData, FilterBy, SortBy, UserInfo, StorageType } from '../types/task';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import ConfirmationModal from '../components/ConfirmationModal';
import TaskFilters from '../components/TaskFilters';
import './TaskList.css';
import { deleteTask, getFilteredTasks, getTasks, updateTaskStatus } from '../utils/task';
import { addTask } from '../utils/task';
import { getUserInfo } from '../utils/user';
import { initializeTheme } from '../utils/theme';

function getPriorty(priority: string): 'Low' | 'Medium' | 'High' {
	switch (priority) {
		case 'High':
			return 'High';
		case 'Medium':
			return 'Medium';
		case 'Low':
			return 'Low';
		default:
			return 'Low';
	}
}

function getStatus(status: string): 'Active' | 'Completed' | 'Expired' {
	switch (status) {
		case 'Active':
			return 'Active';
		case 'Completed':
			return 'Completed';
		case 'Expired':
			return 'Expired';
		default:
			return 'Active';
	}
}

function TaskList() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [filterBy, setFilterBy] = useState<FilterBy>('all');
	const [sortBy, setSortBy] = useState<SortBy>('deadline');
	const [userInfo, setUserInfo] = useState<UserInfo>({
		firstName: '',
		lastName: '',
		username: '',
		email: ''
	});
	const [confirmationModal, setConfirmationModal] = useState<{
		isOpen: boolean;
		taskId: number | null;
		taskTitle: string;
	}>({
		isOpen: false,
		taskId: null,
		taskTitle: ''
	});
	useEffect(() => {
		const updateTaskStatuses = () => {
			const now = new Date();
			now.setHours(0, 0, 0, 0);

			setTasks(prevTasks => prevTasks.map(task => {
				if (task.status === 'Completed') return task;
				const taskDeadline = new Date(task.deadline);
				taskDeadline.setHours(0, 0, 0, 0);

				if (taskDeadline < now) {
					updateTaskStatus(task.id, 'Expired');
					return { ...task, status: 'Expired' as const };
				} else {
					return {
						...task,
						status: 'Active' as const
					};
				}
			}));
		};
		updateTaskStatuses(); const
			interval = setInterval(updateTaskStatuses, 60000); return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		initializeTheme();
		const GetUserInfo = async () => {
			try {
				const user = await getUserInfo();
				if (user) {
					setUserInfo(user)
				}
			} catch (error) {
				console.error("Failed to fetch user info:", error);
			}
		}

		GetUserInfo();
	}, []);
	useEffect(() => {
		const GetTasks = async () => {
			try {
				const tasksData = await getTasks();
				const newtasks = tasksData.map(t => ({
					id: t.id,
					title: t.title,
					priority: getPriorty(t.priority),
					deadline: t.deadline,
					status: getStatus(t.status),
					createdAt: t.created_at,
				}));
				setTasks(newtasks);
			} catch (error) {
				console.error("Failed to fetch tasks:", error);
			}
		};
		GetTasks();
	}, []);
	const handleAddTask = async (taskData: TaskFormData) => {
		const newTask: Task = {
			id: 0, // Temporary ID, will be replaced by backend
			title: taskData.title,
			priority: taskData.priority,
			deadline: taskData.deadline,
			status: 'Active',
			createdAt: new Date().toISOString()
		};
		const id = await addTask({
			id: newTask.id,
			created_at: newTask.createdAt,
			title: newTask.title,
			deadline: newTask.deadline,
			status: newTask.status,
			priority: newTask.priority
		});
		const savedTask = { ...newTask, id };
		setTasks(prev => [...prev, savedTask]);
	};

	const handleToggleComplete = (taskId: number) => {
		setTasks(prev =>
			prev.map(task =>
				task.id === taskId
					? {
						...task,
						status: task.status === 'Completed' ? 'Active' : 'Completed'
					}
					: task
			)
		);
		const task = tasks.find(t => t.id === taskId);
		if (!task) return;
		updateTaskStatus(task.id, task.status === 'Completed' ? 'Active' : 'Completed');

	};

	const handleDeleteRequest = (taskId: number, taskTitle: string) => {
		setConfirmationModal({
			isOpen: true,
			taskId,
			taskTitle
		});
	};

	const handleConfirmDelete = () => {
		if (confirmationModal.taskId !== null) {
			setTasks(prev => prev.filter(task => task.id !== confirmationModal.taskId));
			deleteTask(confirmationModal.taskId);
			setConfirmationModal({
				isOpen: false,
				taskId: null,
				taskTitle: ''
			});
		}
	};

	const handleCancelDelete = () => {
		setConfirmationModal({
			isOpen: false,
			taskId: null,
			taskTitle: ''
		});
	};


	const filteredTasks = getFilteredTasks(tasks, filterBy, sortBy);
	const taskCounts = {
		total: tasks.length,
		active: tasks.filter(t => t.status === 'Active').length,
		completed: tasks.filter(t => t.status === 'Completed').length,
		expired: tasks.filter(t => t.status === 'Expired').length
	};

	return (
		<div className="task-list-page">
			<Navbar username={userInfo.username} email={userInfo.email} />
			<div className="task-list-container">
				<div className="task-list-header">
					<div className="header-content">
						<h1>My Tasks</h1>
						<div className="task-stats">
							<span className="stat-item">
								<span className="stat-number">{taskCounts.total}</span>
								<span className="stat-label">Total</span>
							</span>
							<span className="stat-item">
								<span className="stat-number active">{taskCounts.active}</span>
								<span className="stat-label">Active</span>
							</span>
							<span className="stat-item">
								<span className="stat-number completed">{taskCounts.completed}</span>
								<span className="stat-label">Completed</span>
							</span>
							<span className="stat-item">
								<span className="stat-number expired">{taskCounts.expired}</span>
								<span className="stat-label">Expired</span>
							</span>
						</div>
					</div>
					<Button onClick={() => setIsModalOpen(true)}
						variant="primary"
						size="medium"
					>+ Add Task
					</Button>
				</div>

				<TaskFilters filterBy={filterBy} sortBy={sortBy} onFilterChange={setFilterBy}
					onSortChange={setSortBy} />

				<div className="tasks-section">
					{filteredTasks.length > 0 ? (
						<div className="tasks-list">
							{filteredTasks.map(task => (
								<TaskItem key={task.id} task={task} onToggleComplete={handleToggleComplete}
									onDeleteRequest={handleDeleteRequest} />
							))}
						</div>
					) : (
						<div className="empty-state">
							<div className="empty-icon">📝</div>
							<h3>No tasks found</h3>
							<p>
								{filterBy === 'all' 
									? "Get started by adding your first task!"
									: filterBy === 'today' 
									? "No tasks are due today."
									: filterBy === 'week'
									? "No tasks are due this week."
									: filterBy === 'overdue'
									? "Great! You have no overdue tasks."
									: `No ${filterBy.toLowerCase()} tasks available.`
								}
							</p>
							{filterBy === 'all' && (
								<Button onClick={() => setIsModalOpen(true)} variant="primary">
									Add Your First Task
								</Button>
							)}
						</div>
					)}
				</div>
			</div>
			<TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
				onSubmit={handleAddTask}
			/>

			<ConfirmationModal
				isOpen={confirmationModal.isOpen}
				title="Delete Task"
				message={`Are you sure you want to delete "${confirmationModal.taskTitle}"? This action cannot be undone.`}
				confirmText="Delete"
				cancelText="Cancel"
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				isDangerous={true}
			/>
		</div>
	);
};
export default TaskList;

