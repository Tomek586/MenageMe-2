import { getCurrentUser } from "../services/userService";
import { logout } from "../services/authService";

export const Navbar = () => {
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    window.location.reload(); // Przeładuj aplikację, by wrócić do logowania
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">ManagMe</h1>
          <p>
            Welcome, {user.firstName} {user.lastName} ({user.role})
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Wyloguj
        </button>
      </div>
    </nav>
  );
};
