import { useState } from 'react';
import InputField from './InputField';
import { UserIcon, AtIcon, EmailIcon } from './icons/Icons';
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
					onChange={updateField('username')} icon={<UserIcon />}
					required
				/>

				<InputField type="email" placeholder="Enter Email" value={formData.email} onChange={updateField('email')}
					icon={<AtIcon />}
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
