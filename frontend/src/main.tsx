import React from 'react'
import '../wailsjs/runtime/runtime.js';
import '../wailsjs/go/app/App.js';
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App'

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
