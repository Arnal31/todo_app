import { useState } from 'react';
import InputField from './InputField';

interface FormData {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
}

interface CreateAccountFormProps {
	onSubmit: (formData: FormData) => void;
}

function CreateAccountForm({ onSubmit }: CreateAccountFormProps) {
	const [formData, setFormData] = useState<FormData>({
		firstName: '',
		lastName: '',
		username: '',
		email: ''
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
	};

	const updateField = (field: keyof FormData) => (value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const UserIcon = () => (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
			<circle cx="12" cy="7" r="4"></circle>
		</svg>
	);

	const AtIcon = () => (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<circle cx="12" cy="12" r="4"></circle>
			<path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
		</svg>
	);

	const EmailIcon = () => (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
			<polyline points="22,6 12,13 2,6"></polyline>
		</svg>
	);

	return (
		<div className="form-container">
			<h2 className="form-title">Create Account</h2>

			<form onSubmit={handleSubmit} className="create-account-form">
				<InputField type="text" placeholder="Enter First Name" value={formData.firstName}
					onChange={updateField('firstName')} icon={<UserIcon />}
					required
				/>

				<InputField type="text" placeholder="Enter Last Name" value={formData.lastName}
					onChange={updateField('lastName')} icon={<UserIcon />}
					required
				/>

				<InputField type="text" placeholder="Enter Username" value={formData.username}
					onChange={updateField('username')} icon={<AtIcon />}
					required
				/>

				<InputField type="email" placeholder="Enter Email" value={formData.email} onChange={updateField('email')}
					icon={<EmailIcon />}
					required
				/>

				<button type="submit" className="create-button">
					Create
				</button>
			</form>
		</div>
	);
};

export default CreateAccountForm;
