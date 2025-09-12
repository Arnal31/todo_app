import { useState, useEffect } from 'react';
import { Task, TaskFormData, FilterBy, SortBy } from '../types/task';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import TaskFilters from '../components/TaskFilters';
import './TaskList.css';
import { getFilteredTasks } from '../utils/task';

function TaskList() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [filterBy, setFilterBy] = useState<FilterBy>('all');
	const [sortBy, setSortBy] = useState<SortBy>('deadline');

	useEffect(() => {
		const updateTaskStatuses = () => {
			const now = new Date();
			now.setHours(0, 0, 0, 0);

			setTasks(prevTasks => prevTasks.map(task => {
				if (task.status === 'Completed') return task;
				const taskDeadline = new Date(task.deadline);
				taskDeadline.setHours(0, 0, 0, 0);

				if (taskDeadline < now) { return { ...task, status: 'Expired' as const }; } else {
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

	const handleAddTask = (taskData: TaskFormData) => {
		const newTask: Task = {
			id: Date.now().toString(),
			title: taskData.title,
			priority: taskData.priority,
			deadline: taskData.deadline,
			status: 'Active',
			createdAt: new Date().toISOString()
		};

		setTasks(prev => [...prev, newTask]);
	};

	const handleToggleComplete = (taskId: string) => {
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
	};

	const handleDeleteTask = (taskId: string) => {
		setTasks(prev => prev.filter(task => task.id !== taskId));
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
			<Navbar />
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
									onDelete={handleDeleteTask} />
							))}
						</div>
					) : (
						<div className="empty-state">
							<div className="empty-icon">📝</div>
							<h3>No tasks found</h3>
							<p>
								{filterBy === 'all'
									? "Get started by adding your first task!"
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
		</div>
	);
};

export default TaskList;
