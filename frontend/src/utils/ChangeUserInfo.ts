import { UpdateUserInfo } from '../../wailsjs/go/app/App.js';

interface changeUserInfoPropts {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
}


export async function changeUserInfo(userInfo: changeUserInfoPropts) {
	try {
		await UpdateUserInfo(userInfo);
		alert('User information updated successfully!');
	} catch (error) {
		console.error('Error updating user information:', error);
		alert('Failed to update user information. Please try again.');
	}

}
