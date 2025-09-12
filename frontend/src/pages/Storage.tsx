import { useNavigate } from 'react-router-dom';
import StorageConfigForm from '../components/StorageConfigForm';
import { connectToDatabase } from '../utils/ConnectToDB';
import './Storage.css';

interface PostgresConfig {
	username: string;
	host: string;
	port: number;
	password: string;
	sslMode: string;
	dbName: string;
}

function Storage() {
	const navigate = useNavigate();
	const handleConfigSubmit = async (config: PostgresConfig) => {
		await connectToDatabase(config);
		alert('Database connection successful!');
		navigate('/');
	}


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
