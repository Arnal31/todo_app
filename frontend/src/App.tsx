import * as ReactRouter from 'react-router-dom';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import Storage from './pages/Storage';
import TaskList from './pages/TaskList';
import './App.css';

const { BrowserRouter: Router, Routes, Route } = ReactRouter;

function App() {
	return (
		<Router>
			<div id="App">
				<main className="main-content">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/create_account" element={<CreateAccount />} />
						<Route path="/storage" element={<Storage />} />
						<Route path="/tasks" element={<TaskList />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}
export default App
