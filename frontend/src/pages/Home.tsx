import React, { useState } from 'react';
import logo from '../assets/images/logo-universal.png';
import { } from '../../wailsjs/go/app/App';

import { UpdateUserInfo } from '../../wailsjs/go/app/App';
import { useNavigate } from 'react-router-dom';
const MOCK = {
	firstName: "John",
	lastName: "Doe",
	username: "johndoe",
	email: "dsad@dsa"
}

const Home: React.FC = () => {
	const [resultText, setResultText] = useState("Please enter your name below 👇");
	const [name, setName] = useState('');

	const updateName = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
	const updateResultText = (result: string) => setResultText(result);
	const navigate = useNavigate();
	function greet() {
		navigate('/create_account');
	}

	return (
		<div id="App">
			<img src={logo} id="logo" alt="logo" />
			<div id="result" className="result">{resultText}</div>
			<div id="input" className="input-box">
				<input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text" />
				<button className="btn" onClick={greet}>Greet</button>
			</div>
		</div>
	);
};

export default Home;
