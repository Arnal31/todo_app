import React from 'react';
import './InputField.css';

interface InputFieldProps {
	type: 'text' | 'email' | 'password' | 'number';
	placeholder: string;
	value: string | number;
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
				<input 
					type={type} 
					placeholder={placeholder} 
					value={value} 
					onChange={(e) => {
						const inputValue = e.target.value;
						// For number inputs, only allow numeric characters
						if (type === 'number') {
							if (inputValue === '' || /^\d+$/.test(inputValue)) {
								onChange(inputValue);
							}
						} else {
							onChange(inputValue);
						}
					}}
					required={required}
					disabled={disabled}
					className="input"
					min={type === 'number' ? 0 : undefined}
					max={type === 'number' ? 65535 : undefined}
				/>
			</div>
		</div>
	);
};

export default InputField;
