import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

export default function Chat() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const room = localStorage.getItem("room");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!room) {
      nav("/rooms");
      return;
    }

    // Debug helpers (you can remove later)
    socket.on("connect", () => console.log("socket connected:", socket.id));
    socket.on("connect_error", (e) => console.log("socket connect_error:", e.message));

    // Listen first, then join
    const onSystem = (m) => setMessages((prev) => [...prev, { type: "system", ...m }]);
    const onGroup = (m) => setMessages((prev) => [...prev, { type: "group", ...m }]);

    socket.on("systemMsg", onSystem);
    socket.on("groupMessage", onGroup);

    socket.emit("registerUser", { username: user.username });
    socket.emit("joinRoom", { username: user.username, room });

    // IMPORTANT: do NOT socket.disconnect() in dev (StrictMode will break it)
    return () => {
      socket.off("systemMsg", onSystem);
      socket.off("groupMessage", onGroup);
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [nav, room, user.username]);

  function send() {
    const trimmed = text.trim();
    if (!trimmed) return;

    socket.emit("groupMessage", {
      from_user: user.username,
      room,
      message: trimmed,
    });
    setText("");
  }

  function leaveRoom() {
    socket.emit("leaveRoom");
    localStorage.removeItem("room");
    nav("/rooms");
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("room");
    nav("/login");
  }

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Room: {room}</h1>
          <p className="text-sm">User: {user.username}</p>
        </div>
        <div className="flex gap-2">
          <button className="border rounded px-3 py-1" onClick={leaveRoom}>Leave Room</button>
          <button className="border rounded px-3 py-1" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="border rounded-2xl p-3 h-[420px] overflow-auto space-y-2">
        {messages.map((m, i) => (
          <div key={i} className="text-sm">
            {m.type === "system" ? (
              <i>{m.message}</i>
            ) : (
              <>
                <b>{m.from_user}</b>: {m.message}
                <span className="opacity-60"> ({m.date_sent})</span>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="border rounded px-4" onClick={send}>Send</button>
      </div>
    </div>
  );
}
