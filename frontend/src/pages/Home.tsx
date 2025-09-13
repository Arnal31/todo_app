import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { getUserInfo } from '../utils/user';
import './Home.css';

function Home() {
	const navigate = useNavigate();
	const handleStartClick = () => {
		navigate('/create_account');
	};

	useEffect(() => {
		const checkAccount = async () => {
			const userInfo = await getUserInfo();
			if (userInfo && userInfo.username && userInfo.email && userInfo.firstName && userInfo.lastName) {
				navigate('/tasks');
			}
		};
		checkAccount();
	}, []);

	return (
		<div className="home-page">
			<div className="home-container">
				<div className="home-content">
					<h1 className="home-title">Welcome to Todo App</h1>
					<p className="home-subtitle">
						Organize your tasks and boost your productivity with our simple and elegant todo application.
					</p>
					<Button variant="primary" size="large" onClick={handleStartClick}>
						Get Started
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Home;
