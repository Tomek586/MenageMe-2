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

// Funkcja mockująca listę użytkowników (dalej może być używana)
export const getUsers = () => {
	return [
		{
			id: 1,
			firstName: "Admin",
			lastName: "User",
			role: "admin",
		},
		{
			id: 2,
			firstName: "Dev",
			lastName: "One",
			role: "developer",
		},
		{
			id: 3,
			firstName: "DevOps",
			lastName: "Two",
			role: "devops",
		},
	];
};
