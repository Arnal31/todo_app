import { Task } from '../types/task';
import Button from './Button';
import './TaskItem.css';
import { getPriorityColor, getTaskStatusClass } from '../utils/task';


interface TaskItemProps {
	task: Task;
	onToggleComplete: (taskId: number) => void;
	onDeleteRequest: (taskId: number, taskTitle: string) => void;
}

function TaskItem({ task, onToggleComplete, onDeleteRequest }: TaskItemProps) {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	};

	return (
		<div className={`task-item ${getTaskStatusClass(task)}`}>
			<div className="task-content">
				<div className="task-header">
					<h3 className="task-title">{task.title}</h3>
					<div className="task-actions">
						<Button size="small" variant={task.status === 'Completed' ? 'secondary' : 'primary'} onClick={() =>
							onToggleComplete(task.id)}
						>
							{task.status === 'Completed' ? 'Undo' : 'Complete'}
						</Button>
						<Button size="small" variant="danger" onClick={() => onDeleteRequest(task.id, task.title)}
						>
							Delete
						</Button>
					</div>
				</div>

				<div className="task-details">
					<div className="task-priority">
						<span className="priority-badge" style={{ backgroundColor: getPriorityColor(task) }}>
							{task.priority}
						</span>
					</div>

					<div className="task-deadline">
						<span className="deadline-label">Due:</span>
						<span className="deadline-date">{formatDate(task.deadline)}</span>
					</div>

					<div className="task-status">
						<span className="status-badge">{task.status}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TaskItem;
