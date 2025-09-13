import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import Storage from './pages/Storage';
import TaskList from './pages/TaskList';
import Settings from './pages/Settings';
import { initializeTheme } from './utils/theme';
import './App.css';

function App() {
	useEffect(() => {
		// Initialize theme on app load
		initializeTheme();
	}, []);

	return (
		<Router>
			<div id="App">
				<main className="main-content">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/create_account" element={<CreateAccount />} />
						<Route path="/storage" element={<Storage />} />
						<Route path="/tasks" element={<TaskList />} />
						<Route path="/settings" element={<Settings />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}
export default App
