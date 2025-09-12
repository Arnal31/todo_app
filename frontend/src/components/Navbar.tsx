import React from 'react';
import './Navbar.css';

interface NavbarProps {
	username?: string;
}

const Navbar: React.FC<NavbarProps> = ({ username = "User" }) => {
	return (
		<nav className="navbar">
			<div className="navbar-content">
				<h1 className="navbar-title">{username}</h1>
				<div className="navbar-subtitle">simplecompany@gmail.com</div>
			</div>
		</nav>
	);
};

export default Navbar;
