import { useState } from 'react';
import InputField from './InputField';
import Dropdown, { DropdownOption } from './Dropdown';
import './StorageConfigForm.css';
import { UserIcon, ServerIcon, LockIcon, ShieldIcon } from './icons/Icons';

interface PostgresConfig {
	username: string;
	host: string;
	port: number;
	password: string;
	sslMode: string;
	dbName: string;
}

interface StorageConfigFormProps {
	onSubmit: (config: PostgresConfig, hasPostgres: boolean) => void;
}

const SSLMODEOPTIONS: DropdownOption[] = [
	{ value: 'disable', label: 'Disable' },
	{ value: 'require', label: 'Require' },
	{ value: 'verify-ca', label: 'Verify CA' },
	{ value: 'verify-full', label: 'Verify Full' },
	{ value: 'prefer', label: 'Prefer' }
];
function StorageConfigForm({ onSubmit }: StorageConfigFormProps) {
	const [hasPostgres, setHasPostgres] = useState(false);
	const [config, setConfig] = useState<PostgresConfig>({
		username: '',
		host: '',
		port: 0,
		password: '',
		sslMode: '',
		dbName: ''
	});


	const handleInputChange = (field: keyof PostgresConfig, value: string) => {
		setConfig(prev => ({
			...prev,
			[field]: field === 'port' ? (value === '' ? 0 : parseInt(value, 10)) : value
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (hasPostgres) {
			onSubmit(config, hasPostgres);
		} else {
			onSubmit({
				username: '',
				host: '',
				port: 0,
				password: '',
				sslMode: '',
				dbName: '',
			}, hasPostgres);
		}
	};
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

					<InputField type="number" placeholder="Port" value={config.port === 0 ? '' : config.port.toString()} onChange={(value) =>
						handleInputChange('port', value)}
						icon={
							<ServerIcon />}
						disabled={!hasPostgres}
						required
					/>

					<InputField type="text" placeholder="DBName" value={config.dbName} onChange={(value) =>
						handleInputChange('dbName', value)}
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

					<Dropdown options={SSLMODEOPTIONS} value={config.sslMode} onChange={(value) =>
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
