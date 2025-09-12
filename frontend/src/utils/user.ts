import { GetUserInfo } from "../../wailsjs/go/app/App";
import { UpdateUserInfo } from '../../wailsjs/go/app/App';

interface UserInfoPayload {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
}

export async function getUserInfo() {
	try {
		const userInfo: UserInfoPayload = await GetUserInfo();
		return userInfo;
	} catch (error) {
		console.error("Failed to fetch user info:", error);
		return null;
	}
}

export async function changeUserInfo(userInfo: UserInfoPayload) {
	try {
		await UpdateUserInfo(userInfo);
	} catch (error) {
		console.error("Failed to update user info:", error);
	}
}
