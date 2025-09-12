import { ConnectToDatabase } from '../../wailsjs/go/app/App.js';

interface DBParams {
	host: string;
	port: number;
	username: string;
	password: string;
	dbName: string;
	sslMode: string;
}

export async function connectToDatabase(params: DBParams): Promise<void> {
	try {
		await ConnectToDatabase(params);
		alert('Database connection successful!');
	} catch (error) {
		console.error('Error connecting to database:', error);
		alert('Failed to connect to database. Please check your settings and try again.');
	}
}
