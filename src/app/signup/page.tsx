"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../../lib/api";

export default function SignupPage() {
    const [form, setForm] = useState({ name: "", email: "", address: "", password: "" });
    const router = useRouter();

    const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSignup = async (e: any) => {
        e.preventDefault();
        try {
            await API.post("/auth/register", form);
            alert("Signup successful, please login.");
            router.push("/");
        } catch (err: any) {
            alert(err.response?.data?.errors || "Signup failed");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-96">
                <h1 className="text-xl font-bold mb-4">Signup</h1>
                <input name="name" placeholder="Full Name" onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded" required />
                <input name="email" type="email" placeholder="Email" onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded" required />
                <input name="address" placeholder="Address" onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded" required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded" required />
                <button type="submit" className="bg-green-500 text-white w-full py-2 rounded">
                    Signup
                </button>
            </form>
        </div>
    );
}
