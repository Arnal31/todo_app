import React from 'react';
import './Dropdown.css';

export interface DropdownOption {
	value: string;
	label: string;
}

interface DropdownProps {
	options: DropdownOption[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	icon?: React.ReactNode;
}

function Dropdown({
	options,
	value,
	onChange,
	placeholder = "Select an option",
	disabled = false,
	icon
}: DropdownProps) {
	return (
		<div className={`dropdown-field ${disabled ? 'disabled' : ''}`}>
			<div className="dropdown-wrapper">
				{icon && (
					<div className="dropdown-icon">
						{icon}
					</div>
				)}
				<select className="dropdown-select" value={value} onChange={(e) => onChange(e.target.value)}
					disabled={disabled}
				>
					<option value="" disabled>
						{placeholder}
					</option>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};

export default Dropdown;
