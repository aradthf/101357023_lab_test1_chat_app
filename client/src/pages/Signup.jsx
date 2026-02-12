import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", firstname: "", lastname: "", password: "" });
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("");

    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setMsg(data.message || "Signup failed");

    setMsg("Signup successful. Redirecting to login...");
    setTimeout(() => nav("/login"), 900);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md border rounded-2xl p-6 space-y-3">
        <h1 className="text-2xl font-semibold">Signup</h1>

        <input className="w-full border p-2 rounded" placeholder="Username"
          value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input className="w-full border p-2 rounded" placeholder="First name"
          value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })}
        />
        <input className="w-full border p-2 rounded" placeholder="Last name"
          value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })}
        />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full border rounded p-2">Create account</button>

        {msg && <p className="text-sm">{msg}</p>}

        <p className="text-sm">
          Already have an account? <Link className="underline" to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
