import React, { useState } from 'react';
import InputField from './InputField';
import Dropdown, { DropdownOption } from './Dropdown';
import './StorageConfigForm.css';

interface PostgresConfig {
	username: string;
	host: string;
	port: string;
	password: string;
	sslMode: string;
}

interface StorageConfigFormProps {
	onSubmit: (config: PostgresConfig) => void;
}

function StorageConfigForm({ onSubmit }: StorageConfigFormProps) {
	const [hasPostgres, setHasPostgres] = useState(false);
	const [config, setConfig] = useState<PostgresConfig>({
		username: '',
		host: '',
		port: '',
		password: '',
		sslMode: ''
	});

	const sslModeOptions: DropdownOption[] = [
		{ value: 'disable', label: 'Disable' },
		{ value: 'require', label: 'Require' },
		{ value: 'verify-ca', label: 'Verify CA' },
		{ value: 'verify-full', label: 'Verify Full' },
		{ value: 'prefer', label: 'Prefer' }
	];

	const handleInputChange = (field: keyof PostgresConfig, value: string) => {
		setConfig(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (hasPostgres) {
			// Submit with Postgres configuration
			onSubmit(config);
		} else {
			// Submit with empty config - will use local SQLite
			onSubmit({
				username: '',
				host: '',
				port: '',
				password: '',
				sslMode: ''
			});
		}
	};

	const UserIcon = () => (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
			<circle cx="12" cy="7" r="4"></circle>
		</svg>
	);

	const ServerIcon = () => (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<rect x="2" y="3" width="20" height="3" rx="1" ry="1"></rect>
			<rect x="2" y="8" width="20" height="3" rx="1" ry="1"></rect>
			<rect x="2" y="13" width="20" height="3" rx="1" ry="1"></rect>
			<line x1="6" y1="18" x2="6" y2="18"></line>
			<line x1="10" y1="18" x2="10" y2="18"></line>
		</svg>
	);

	const LockIcon = () => (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
			<circle cx="12" cy="16" r="1"></circle>
			<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
		</svg>
	);

	const ShieldIcon = () => (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
		</svg>
	);

	return (
		<div className="storage-form-container">
			<h2 className="storage-form-title">Storage</h2>

			<form onSubmit={handleSubmit} className="storage-config-form">
				<div className="checkbox-container">
					<label className="checkbox-label">
						<input type="checkbox" name="postgres" checked={hasPostgres} onChange={(e) =>
							setHasPostgres(e.target.checked)}
							className="checkbox-input"
						/>
						<span className="checkbox-text">Do you have Postgres server?</span>
					</label>
				</div>
				<div className={`form-fields ${!hasPostgres ? 'disabled' : ''}`}>
					<InputField type="text" placeholder="Username" value={config.username} onChange={(value) =>
						handleInputChange('username', value)}
						icon={
							<UserIcon />}
						disabled={!hasPostgres}
						required
					/>

					<InputField type="text" placeholder="Host" value={config.host} onChange={(value) =>
						handleInputChange('host', value)}
						icon={
							<ServerIcon />}
						disabled={!hasPostgres}
						required
					/>

					<InputField type="text" placeholder="Port" value={config.port} onChange={(value) =>
						handleInputChange('port', value)}
						icon={
							<ServerIcon />}
						disabled={!hasPostgres}
						required
					/>

					<InputField type="password" placeholder="Password" value={config.password}
						onChange={(value) => handleInputChange('password', value)}
						icon={
							<LockIcon />}
						disabled={!hasPostgres}
						required
					/>

					<Dropdown options={sslModeOptions} value={config.sslMode} onChange={(value) =>
						handleInputChange('sslMode', value)}
						placeholder="Select SSL Mode"
						disabled={!hasPostgres}
						icon={
							<ShieldIcon />}
					/>
				</div>

				<button type="submit" className="next-button">
					{hasPostgres ? 'Next' : 'Continue with Local Storage'}
				</button>
			</form>
		</div>
	);
};

export default StorageConfigForm;
