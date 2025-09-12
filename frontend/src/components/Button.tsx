import React from 'react';
import './Button.css';

interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	variant?: 'primary' | 'secondary' | 'danger';
	size?: 'small' | 'medium' | 'large';
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset';
}

function Button({
	children,
	onClick,
	variant = 'primary',
	size = 'medium',
	disabled = false,
	type = 'button'
}: ButtonProps) {
	return (
		<button type={type} className={`btn btn-${variant} btn-${size}`} onClick={onClick} disabled={disabled}>
			{children}
		</button>
	);
};

export default Button;
