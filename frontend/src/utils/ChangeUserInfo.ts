import { UpdateUserInfo } from '../../wailsjs/go/app/App';
import { Greet } from '../../wailsjs/go/app/App';


interface UserInfoPayload {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
}

export async function changeUserInfo(userInfo: UserInfoPayload){
	try {
		await UpdateUserInfo(UserInfoPayload);
	} catch (error) {
		console.error("Failed to update user info:", error);
	}
}
