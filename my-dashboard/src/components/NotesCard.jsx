import { useState } from "react";

export default function NotesCard() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("normal");

  const addNote = () => {
    if (!text.trim()) return;
    setNotes([...notes, { id: Date.now(), text, priority }]);
    setText("");
  };

  const removeNote = (id) => setNotes(notes.filter((n) => n.id !== id));

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
         Note Manager
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Add a new note"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="important">Important</option>
          <option value="normal">Normal</option>
          <option value="delayed">Delayed</option>
        </select>

        <div className="col-span-1 sm:col-span-2 flex justify-center">
          <button
            onClick={addNote}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-sm"
          >
            Add
          </button>
        </div>
      </div>

      {["important", "normal", "delayed"].map((p) => (
        <div key={p} className="mb-4">
          <h4
            className={`font-semibold capitalize mb-2 ${p === "important"
                ? "text-red-600"
                : p === "normal"
                  ? "text-blue-600"
                  : "text-yellow-600"
              }`}
          >
            {p} Notes
          </h4>

          <ul className="space-y-2">
            {notes
              .filter((n) => n.priority === p)
              .map((n) => (
                <li
                  key={n.id}
                  className="flex justify-between items-center bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <span className="text-sm text-gray-700">{n.text}</span>
                  <button
                    onClick={() => removeNote(n.id)}
                    className="text-red-500 hover:text-red-600 text-sm font-semibold"
                  >
                    ✕
                  </button>
                </li>
              ))}
            {notes.filter((n) => n.priority === p).length === 0 && (
              <p className="text-sm text-gray-400 italic">No {p} notes yet</p>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
