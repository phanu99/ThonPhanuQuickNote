import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import Slideshow from "./Slideshow";

const sampleImages = [
  "https://source.unsplash.com/random/800x600?nature",
  "https://source.unsplash.com/random/800x600?city",
  "https://source.unsplash.com/random/800x600?technology",
];


const pastelColors = [
  "#ffe4e6",
  "#e0f2fe",
  "#fef9c3",
  "#dcfce7",
  "#ede9fe",
  "#fce7f3",
  "#f0fdf4",
];

function getRandomColor() {
  return pastelColors[Math.floor(Math.random() * pastelColors.length)];
}

function App() {
  const [notes, setNotes] = useState(() => {
    const stored = localStorage.getItem("notes");
    return stored ? JSON.parse(stored) : [];
  });

  const [view, setView] = useState("home"); // 'home', 'add', 'view'

  const [newNote, setNewNote] = useState({ title: "", content: "" });

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("dateDesc");

  const [currentNote, setCurrentNote] = useState(null); // note being viewed
  const [editingNoteId, setEditingNoteId] = useState(null); // note being edited

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  const sortedNotes = filteredNotes.slice().sort((a, b) => {
    switch (sortKey) {
      case "dateAsc":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "dateDesc":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "titleAsc":
        return a.title.localeCompare(b.title);
      case "titleDesc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  function handleSave() {
    if (newNote.title.trim() || newNote.content.trim()) {
      if (editingNoteId) {
        // update existing note
        setNotes(
          notes.map((note) =>
            note.id === editingNoteId ? { ...note, ...newNote } : note
          )
        );
        setEditingNoteId(null);
        setCurrentNote({ ...newNote, id: editingNoteId }); // update current note display
        setView("view");
      } else {
        // add new note
        const noteToAdd = {
          ...newNote,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          color: getRandomColor(),
        };
        setNotes([...notes, noteToAdd]);
        setView("home");
      }
      setNewNote({ title: "", content: "" });
    }
  }

  function openNote(note) {
    setCurrentNote(note);
    setView("view");
  }

  function deleteCurrentNote() {
    if (!currentNote) return;
    setNotes(notes.filter((n) => n.id !== currentNote.id));
    setCurrentNote(null);
    setView("home");
  }

  function startEditNote() {
    if (!currentNote) return;
    setEditingNoteId(currentNote.id);
    setNewNote({ title: currentNote.title, content: currentNote.content });
    setView("add");
  }

  function cancelEdit() {
    setEditingNoteId(null);
    setNewNote({ title: "", content: "" });
    if (currentNote) setView("view");
    else setView("home");
  }

  return (
    <div className="app">
      {view === "home" && (
        <>
          <h1>QuickNotes</h1>



          <div className="home-controls card">
            <button className="add-btn" onClick={() => setView("add")}>
              Add New Note
            </button>

            <input
              type="text"
              placeholder="Search notes..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="sort-select"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
            >
              <option value="dateDesc">Sort by Date (newest)</option>
              <option value="dateAsc">Sort by Date (oldest)</option>
              <option value="titleAsc">Sort by Title (A-Z)</option>
              <option value="titleDesc">Sort by Title (Z-A)</option>
            </select>
          </div>

          <div className="note-list">
            {sortedNotes.map((note) => (
    <div
    key={note.id}
    className="note-card title-only"
    style={{ backgroundColor: note.color || "#fff" }}
    onClick={() => openNote(note)}
             >
         <strong>{note.title || "(No Title)"}</strong>
          <p className="preview-text">
            {(note.content || "(No content)").slice(0, 100)}...
           </p>
             <small className="note-date">
                 {new Date(note.createdAt).toLocaleString()}
                 </small>
                    </div>
                    ))}
          </div>         
        </>
        
      )}
       

      {view === "add" && (
        <>
          <h2>{editingNoteId ? "Edit Note" : "Add New Note"}</h2>
          <div className="add-card card">
            <input
              type="text"
              placeholder="Title"
              className="input"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <textarea
              placeholder="Note Content"
              className="textarea"
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
            />
            <div className="button-group">
              <button className="save-btn" onClick={handleSave}>
                {editingNoteId ? "Save Changes" : "Save"}
              </button>
              <button className="cancel-btn" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

{view === "view" && currentNote && (
  <>
    <h2 style={{ textAlign: "center" }}>{currentNote.title || "(No Title)"}</h2>

    <div
      className="note-card view-note"
      style={{ backgroundColor: currentNote.color || "#fff" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
          alignItems: "center",
        }}
      >
        <button className="cancel-btn" onClick={() => setView("home")}>
          Back to Home
        </button>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="save-btn" onClick={startEditNote}>
            Edit
          </button>
          <button className="delete-btn" onClick={deleteCurrentNote}>
            Delete
          </button>
        </div>
      </div>

      <p>{currentNote.content || "(No Content)"}</p>
      <small className="note-date">
        Created: {new Date(currentNote.createdAt).toLocaleString()}
      </small>
    </div>
  </>
)}

    </div>
  );
}

export default App;
