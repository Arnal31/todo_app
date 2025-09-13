import { ChangeTheme, GetTheme } from "../../wailsjs/go/app/App";

export type Theme = 'light' | 'dark';

export async function changeTheme(newTheme: Theme) {
	try {
		await ChangeTheme(newTheme);
		document.documentElement.setAttribute('data-theme', newTheme);
		console.log(`Theme changed to: ${newTheme}`);
	} catch (error) {
		console.error("Error changing theme:", error);
		throw error;
	}
}

export function getCurrentTheme() {
	const theme = document.documentElement.getAttribute('data-theme');
	return (theme === 'dark' || theme === 'light') ? theme : 'light';
}

export async function loadThemeFromConfig() {
	try {
		const theme = await GetTheme();
		return theme as Theme;
	} catch (error) {
		console.warn('Failed to load theme from config, using default:', error);
		return 'light';
	}
}

export async function initializeTheme() {
	try {
		const savedTheme = await loadThemeFromConfig();
		document.documentElement.setAttribute('data-theme', savedTheme);
	} catch (error) {
		document.documentElement.setAttribute('data-theme', 'light');
	}
}
