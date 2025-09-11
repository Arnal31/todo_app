import React from 'react';
import './InputField.css';

interface InputFieldProps {
	type: 'text' | 'email' | 'password';
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
	icon: React.ReactNode;
	required?: boolean;
	disabled?: boolean;
}

function InputField({
	type,
	placeholder,
	value,
	onChange,
	icon,
	required = false,
	disabled = false
}: InputFieldProps) {
	return (
		<div className={`input-field ${disabled ? 'disabled' : ''}`}>
			<div className="input-wrapper">
				<div className="input-icon">
					{icon}
				</div>
				<input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
					required={required}
					disabled={disabled}
					className="input"
				/>
			</div>
		</div>
	);
};

export default InputField;
