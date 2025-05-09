import { useState } from "react";
import { login, loginWithGoogle } from "../services/authService";
import { GoogleLogin } from "@react-oauth/google";

export const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      onLoginSuccess();
    } catch {
      alert("Błędne dane");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Logowanie</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Zaloguj
        </button>
      </form>
      <div className="mt-6 text-center">
        <GoogleLogin
          onSuccess={(res) => loginWithGoogle(res.credential).then(onLoginSuccess)}
          onError={() => alert("Błąd logowania Google")}
        />
      </div>
    </div>
  );
};
