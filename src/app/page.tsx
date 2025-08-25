"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "admin") router.push("/dashboard/admin");
      else if (res.data.user.role === "user") router.push("/dashboard/user");
      else router.push("/dashboard/owner");
    } catch (err: any) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <input type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border rounded" required />
        <input type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 p-2 border rounded" required />
        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">
          Login
        </button>
        <p className="mt-2 text-sm">
          Don’t have an account? <a href="/signup" className="text-blue-600">Sign Up</a>
        </p>
      </form>
    </div>
  );
}
