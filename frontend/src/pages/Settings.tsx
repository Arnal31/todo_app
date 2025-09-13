import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Dropdown, { DropdownOption } from '../components/Dropdown';
import { getUserInfo, changeUserInfo } from '../utils/user';
import { connectToDatabase } from '../utils/ConnectToDB';
import { changeTheme, getCurrentTheme, Theme } from '../utils/theme';
import './Settings.css';
import { UserIcon, AtIcon, EmailIcon, ServerIcon, LockIcon, DatabaseIcon, ThemeIcon } from '../components/icons/Icons';
interface UserInfo {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
}

interface PostgresConfig {
	host: string;
	port: number;
	username: string;
	password: string;
	dbName: string;
	sslMode: string;
}

const SSLMODE_OPTIONS: DropdownOption[] = [
	{ value: 'disable', label: 'Disable' },
	{ value: 'require', label: 'Require' },
	{ value: 'verify-ca', label: 'Verify CA' },
	{ value: 'verify-full', label: 'Verify Full' },
	{ value: 'prefer', label: 'Prefer' }
];

const THEME_OPTIONS: DropdownOption[] = [
	{ value: 'light', label: 'Light Theme' },
	{ value: 'dark', label: 'Dark Theme' }
];

// Icon Components
function Settings() {
	const navigate = useNavigate();
	const [userInfo, setUserInfo] = useState<UserInfo>({
		firstName: '',
		lastName: '',
		username: '',
		email: ''
	});

	const [postgresConfig, setPostgresConfig] = useState<PostgresConfig>({
		host: 'localhost',
		port: 5432,
		username: '',
		password: '',
		dbName: '',
		sslMode: 'disable'
	});

	const [isLoading, setIsLoading] = useState(false);
	const [userUpdateSuccess, setUserUpdateSuccess] = useState(false);
	const [dbConnectionSuccess, setDbConnectionSuccess] = useState(false);
	const [themeUpdateSuccess, setThemeUpdateSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [currentTheme, setCurrentTheme] = useState<Theme>('light');

	useEffect(() => {
		loadUserInfo();
		loadTheme();
	}, []);

	const loadTheme = () => {
		const theme = getCurrentTheme();
		setCurrentTheme(theme);
	};

	const loadUserInfo = async () => {
		try {
			const currentUserInfo = await getUserInfo();
			if (currentUserInfo) {
				setUserInfo(currentUserInfo);
			}
		} catch (error) {
			console.error('Failed to load user info:', error);
		}
	};

	const handleUserInfoChange = (field: keyof UserInfo, value: string) => {
		setUserInfo(prev => ({
			...prev,
			[field]: value
		}));
		setUserUpdateSuccess(false);
		setErrorMessage('');
	};

	const handlePostgresConfigChange = (field: keyof PostgresConfig, value: string) => {
		setPostgresConfig(prev => ({
			...prev,
			[field]: field === 'port' ? parseInt(value, 10) || 0 : value
		}));
		setDbConnectionSuccess(false);
		setErrorMessage('');
	};

	const handleUserInfoSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setErrorMessage('');

		try {
			await changeUserInfo(userInfo);
			setUserUpdateSuccess(true);
		} catch (error) {
			setErrorMessage('Failed to update user information. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDatabaseConnectionSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setErrorMessage('');

		try {
			await connectToDatabase(postgresConfig);
			setDbConnectionSuccess(true);
		} catch (error) {
			setErrorMessage('Failed to connect to database. Please check your settings and try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleThemeChange = async (newTheme: Theme) => {
		try {
			setIsLoading(true);
			setErrorMessage('');
			await changeTheme(newTheme);
			setCurrentTheme(newTheme);
			setThemeUpdateSuccess(true);
			setTimeout(() => setThemeUpdateSuccess(false), 3000);
		} catch (error) {
			setErrorMessage('Failed to update theme. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleBackToTasks = () => {
		navigate('/tasks');
	};

	return (
		<div className="settings-page">
			<div className="settings-container">
				<div className="settings-header">
					<h1 className="settings-title">Settings</h1>
					<p className="settings-subtitle">Manage your account and database configuration</p>
				</div>

				{errorMessage && (
					<div className="error-message">
						{errorMessage}
					</div>
				)}

				{/* User Information Section */}
				<div className="settings-section">
					<h2 className="section-title">User Information</h2>
					<form onSubmit={handleUserInfoSubmit} className="settings-form">
						<div className="form-row">
							<div className="field-group">
								<label className="field-label">First Name</label>
								<InputField
									type="text"
									value={userInfo.firstName}
									onChange={(value) => handleUserInfoChange('firstName', value)}
									placeholder="Enter your first name"
									icon={<UserIcon />}
									required
								/>
							</div>
							<div className="field-group">
								<label className="field-label">Last Name</label>
								<InputField
									type="text"
									value={userInfo.lastName}
									onChange={(value) => handleUserInfoChange('lastName', value)}
									placeholder="Enter your last name"
									icon={<UserIcon />}
									required
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="field-group">
								<label className="field-label">Username</label>
								<InputField
									type="text"
									value={userInfo.username}
									onChange={(value) => handleUserInfoChange('username', value)}
									placeholder="Enter your username"
									icon={<AtIcon />}
									required
								/>
							</div>
							<div className="field-group">
								<label className="field-label">Email</label>
								<InputField
									type="email"
									value={userInfo.email}
									onChange={(value) => handleUserInfoChange('email', value)}
									placeholder="Enter your email"
									icon={<EmailIcon />}
									required
								/>
							</div>
						</div>
						<div className="form-actions">
							<Button
								type="submit"
								variant="primary"
								disabled={isLoading}
							>
								{isLoading ? 'Updating...' : 'Update User Info'}
							</Button>
							{userUpdateSuccess && (
								<span className="success-message">User information updated successfully!</span>
							)}
						</div>
					</form>
				</div>

				{/* Theme Configuration Section */}
				<div className="settings-section">
					<h2 className="section-title">Appearance</h2>
					<div className="settings-form">
						<div className="field-group">
							<label className="field-label">Theme</label>
							<Dropdown
								value={currentTheme}
								onChange={(value) => handleThemeChange(value as Theme)}
								options={THEME_OPTIONS}
								placeholder="Select theme"
								icon={<ThemeIcon />}
							/>
						</div>
						<div className="form-actions">
							{themeUpdateSuccess && (
								<span className="success-message">Theme updated successfully!</span>
							)}
						</div>
					</div>
				</div>

				{/* PostgreSQL Configuration Section */}
				<div className="settings-section">
					<h2 className="section-title">PostgreSQL Database Connection</h2>
					<form onSubmit={handleDatabaseConnectionSubmit} className="settings-form">
						<div className="form-row">
							<div className="field-group">
								<label className="field-label">Host</label>
								<InputField
									type="text"
									value={postgresConfig.host}
									onChange={(value) => handlePostgresConfigChange('host', value)}
									placeholder="localhost"
									icon={<ServerIcon />}
									required
								/>
							</div>
							<div className="field-group">
								<label className="field-label">Port</label>
								<InputField
									type="number"
									value={postgresConfig.port.toString()}
									onChange={(value) => handlePostgresConfigChange('port', value)}
									placeholder="5432"
									icon={<ServerIcon />}
									required
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="field-group">
								<label className="field-label">Username</label>
								<InputField
									type="text"
									value={postgresConfig.username}
									onChange={(value) => handlePostgresConfigChange('username', value)}
									placeholder="Database username"
									icon={<UserIcon />}
									required
								/>
							</div>
							<div className="field-group">
								<label className="field-label">Password</label>
								<InputField
									type="password"
									value={postgresConfig.password}
									onChange={(value) => handlePostgresConfigChange('password', value)}
									placeholder="Database password"
									icon={<LockIcon />}
									required
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="field-group">
								<label className="field-label">Database Name</label>
								<InputField
									type="text"
									value={postgresConfig.dbName}
									onChange={(value) => handlePostgresConfigChange('dbName', value)}
									placeholder="Database name"
									icon={<DatabaseIcon />}
									required
								/>
							</div>
							<div className="field-group">
								<label className="field-label">SSL Mode</label>
								<Dropdown
									options={SSLMODE_OPTIONS}
									value={postgresConfig.sslMode}
									onChange={(value) => handlePostgresConfigChange('sslMode', value)}
									placeholder="Select SSL mode"
									icon={<LockIcon />}
								/>
							</div>
						</div>
						<div className="form-actions">
							<Button
								type="submit"
								variant="primary"
								disabled={isLoading}
							>
								{isLoading ? 'Testing Connection...' : 'Test Connection'}
							</Button>
							{dbConnectionSuccess && (
								<span className="success-message">Database connection successful!</span>
							)}
						</div>
					</form>
				</div>

				{/* Navigation */}
				<div className="settings-navigation">
					<Button variant="secondary" onClick={handleBackToTasks}>
						Back to Tasks
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Settings;
