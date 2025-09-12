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
	} catch (error) {
		throw new Error('Failed to connect to database. Please check your settings and try again.');
	}
}
