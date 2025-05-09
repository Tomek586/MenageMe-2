import { API_URL } from "./config";
import { logout } from "./authService";

export const getCurrentUser = () => {
	const token = localStorage.getItem("accessToken");
	if (!token) return null;

	try {
		const payload = JSON.parse(atob(token.split(".")[1]));
		return {
			id: payload.id,
			firstName: payload.firstName,
			lastName: payload.lastName,
			role: payload.role,
		};
	} catch (err) {
		return err;
	}
};
function authHeader() {
	const token = localStorage.getItem("accessToken");
	return token ? { Authorization: `Bearer ${token}` } : {};
  }
  
  export async function getUsers() {
	const res = await fetch(`${API_URL}/users`, { headers: authHeader() });
	if (res.status === 401) {
	  logout();
	  return [];
	}
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();  // [{id, firstName, lastName, role}, …]
  }


// export const getUsers = () => {
// 	return [
// 		{
// 			id: 1,
// 			firstName: "Admin",
// 			lastName: "User",
// 			role: "admin",
// 		},
// 		{
// 			id: 2,
// 			firstName: "Dev",
// 			lastName: "One",
// 			role: "developer",
// 		},
// 		{
// 			id: 3,
// 			firstName: "DevOps",
// 			lastName: "Two",
// 			role: "devops",
// 		},
// 	];
// };
