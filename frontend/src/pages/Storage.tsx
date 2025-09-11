import React from 'react';
import StorageConfigForm from '../components/StorageConfigForm';
import './Storage.css';

interface PostgresConfig {
	username: string;
	host: string;
	port: string;
	password: string;
	sslMode: string;
}

const Storage: React.FC = () => {
	const handleConfigSubmit = (config: PostgresConfig) => {
		console.log('Storage config submitted:', config);
	};

	return (
		<div className="storage-page">
			<div className="storage-container">
				<div className="left-section">
					<StorageConfigForm onSubmit={handleConfigSubmit} />
				</div>
				<div className="right-section">
				</div>
			</div>
		</div>
	);
};

export default Storage;
