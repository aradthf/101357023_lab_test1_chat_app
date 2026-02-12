import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("");

    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setMsg(data.message || "Login failed");

    localStorage.setItem("user", JSON.stringify(data.user)); // lab requirement
    nav("/rooms");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md border rounded-2xl p-6 space-y-3">
        <h1 className="text-2xl font-semibold">Login</h1>

        <input className="w-full border p-2 rounded" placeholder="Username"
          value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full border rounded p-2">Login</button>

        {msg && <p className="text-sm">{msg}</p>}

        <p className="text-sm">
          No account? <Link className="underline" to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}
