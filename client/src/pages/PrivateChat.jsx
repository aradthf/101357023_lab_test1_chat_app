import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

export default function PrivateChat() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [toUser, setToUser] = useState("");
  const [text, setText] = useState("");
  const [typingMsg, setTypingMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => console.log("socket connected:", socket.id));
    socket.on("connect_error", (e) => console.log("socket connect_error:", e.message));

    const onPrivate = (m) => setMessages((prev) => [...prev, m]);
    const onTyping = ({ from_user }) => setTypingMsg(`${from_user} is typing...`);
    const onStop = () => setTypingMsg("");

    socket.on("privateMessage", onPrivate);
    socket.on("typing", onTyping);
    socket.on("stopTyping", onStop);

    socket.emit("registerUser", { username: user.username });

    return () => {
      socket.off("privateMessage", onPrivate);
      socket.off("typing", onTyping);
      socket.off("stopTyping", onStop);
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [user.username]);

  function send() {
    const trimmed = text.trim();
    const target = toUser.trim();
    if (!trimmed || !target) return;

    socket.emit("privateMessage", {
      from_user: user.username,
      to_user: target,
      message: trimmed,
    });

    setText("");
    socket.emit("stopTyping", { from_user: user.username, to_user: target });
  }

  function onType(v) {
    setText(v);
    const target = toUser.trim();
    if (!target) return;

    socket.emit("typing", { from_user: user.username, to_user: target });

    clearTimeout(window.__typingTimer);
    window.__typingTimer = setTimeout(() => {
      socket.emit("stopTyping", { from_user: user.username, to_user: target });
    }, 700);
  }

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Private Chat</h1>
        <button className="border rounded px-3 py-1" onClick={() => nav("/rooms")}>Back</button>
      </div>

      <input
        className="w-full border rounded p-2"
        placeholder="Send to the User (exact username)"
        value={toUser}
        onChange={(e) => setToUser(e.target.value)}
      />

      <div className="text-sm h-5">{typingMsg}</div>

      <div className="border rounded-2xl p-3 h-[380px] overflow-auto space-y-2">
        {messages.map((m, i) => (
          <div key={i} className="text-sm">
            <b>{m.from_user}</b> → <b>{m.to_user}</b>: {m.message}
            <span className="opacity-60"> ({m.date_sent})</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={text}
          onChange={(e) => onType(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="border rounded px-4" onClick={send}>Send</button>
      </div>
    </div>
  );
}
