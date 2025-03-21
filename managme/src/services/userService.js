export const getCurrentUser = () => {
	return {
		id: 1,
		firstName: "Admin",
		lastName: "User",
		role: "admin",
	};
};

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
