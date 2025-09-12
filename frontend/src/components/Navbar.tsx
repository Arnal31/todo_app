import './Navbar.css';

interface NavbarProps {
	username?: string;
	email?: string;
}

function Navbar({ username = "User", email = "user@emai.com" }: NavbarProps) {
	return (
		<nav className="navbar">
			<div className="navbar-content">
				<h1 className="navbar-title">{username}</h1>
				<div className="navbar-subtitle">{email}</div>
			</div>
		</nav>
	);
};

export default Navbar;
