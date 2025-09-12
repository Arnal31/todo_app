import { useState } from 'react';
import { TaskFormData } from '../types/task';
import Button from './Button';
import './TaskModal.css';

interface TaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (taskData: TaskFormData) => void;
}

function TaskModal({ isOpen, onClose, onSubmit }: TaskModalProps) {
	const [formData, setFormData] = useState<TaskFormData>({
		title: '',
		priority: 'Medium',
		deadline: ''
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		if (formData.title.trim() && formData.deadline) {
			onSubmit(formData);
			setFormData({ title: '', priority: 'Medium', deadline: '' });
			onClose();
		}
	};

	const handleChange = (field: keyof TaskFormData, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		console.log(formData);
	};

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<div className="task-modal-overlay" onClick={handleOverlayClick}>
			<div className="task-modal">
				<div className="task-modal-header">
					<h2>Add New Task</h2>
					<button className="task-modal-close" onClick={onClose}>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className="task-modal-form">
					<div className="form-group">
						<label htmlFor="task-title">Task Title</label>
						<input id="task-title" type="text" placeholder="Enter task title..." value={formData.title}
							onChange={(e) => handleChange('title', e.target.value)}
							required
							className="task-input"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="task-priority">Priority</label>
						<select id="task-priority" value={formData.priority} onChange={(e) => handleChange('priority',
							e.target.value as any)}
							className="priority-select"
						>
							<option value="Low">Low</option>
							<option value="Medium">Medium</option>
							<option value="High">High</option>
						</select>
					</div>

					<div className="form-group">
						<label htmlFor="task-deadline">Deadline</label>
						<input id="task-deadline" type="date" value={formData.deadline} onChange={(e) =>
							handleChange('deadline', e.target.value)}
							required
							className="task-input"
						/>
					</div>

					<div className="task-modal-actions">
						<Button type="button" variant="secondary" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" variant="primary">
							Add Task
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default TaskModal;
