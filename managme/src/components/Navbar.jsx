import { getCurrentUser } from "../services/userService";

export const Navbar = () => {
	const user = getCurrentUser();
	return (
		<nav className="bg-blue-600 text-white p-4">
			<div className="container mx-auto">
				<h1 className="text-xl font-bold">
					ManagMe
				</h1>
				<p>
					Welcome, {user.firstName}{" "}
					{user.lastName}
				</p>
			</div>
		</nav>
	);
};
