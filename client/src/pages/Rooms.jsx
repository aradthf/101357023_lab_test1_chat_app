import { useNavigate } from "react-router-dom";

const ROOMS = ["The Hangout", "Digital Lounge", "Pulse Chat", "sports", "Music"];

export default function Rooms() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  function join(room) {
    localStorage.setItem("room", room);
    nav("/chat");
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("room");
    nav("/login");
  }

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Rooms</h1>
        <button className="border rounded px-3 py-1" onClick={logout}>Logout</button>
      </div>

      <p>Logged in as: <b>{user?.username}</b></p>

      <div className="grid gap-2">
        {ROOMS.map((r) => (
          <button key={r} className="border rounded p-3 text-left" onClick={() => join(r)}>
            Join: {r}
          </button>
        ))}
      </div>

      <button className="border rounded px-3 py-2" onClick={() => nav("/private")}>
        Private Chat (Typing Indicator)
      </button>
    </div>
  );
}
