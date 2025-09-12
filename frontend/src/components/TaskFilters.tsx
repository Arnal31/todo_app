import { FilterBy, SortBy } from '../types/task';
import './TaskFilters.css';

interface TaskFiltersProps {
	filterBy: FilterBy;
	sortBy: SortBy;
	onFilterChange: (filter: FilterBy) => void;
	onSortChange: (sort: SortBy) => void;
}

function TaskFilters({
	filterBy,
	sortBy,
	onFilterChange,
	onSortChange
}: TaskFiltersProps) {
	return (
		<div className="task-filters">
			<div className="filter-section">
				<label htmlFor="filter-select">Filter by Status:</label>
				<select id="filter-select" value={filterBy} onChange={(e) => onFilterChange(e.target.value as FilterBy)}
					className="filter-select"
				>
					<option value="all">All Tasks</option>
					<option value="Active">Active</option>
					<option value="Completed">Completed</option>
					<option value="Expired">Expired</option>
				</select>
			</div>

			<div className="sort-section">
				<label htmlFor="sort-select">Sort by:</label>
				<select id="sort-select" value={sortBy} onChange={(e) => onSortChange(e.target.value as SortBy)}
					className="sort-select"
				>
					<option value="deadline">Deadline</option>
					<option value="priority">Priority</option>
					<option value="status">Status</option>
					<option value="title">Title</option>
				</select>
			</div>
		</div>
	);
};

export default TaskFilters;
