import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";

// Function to format the current date and time as a string
const getCurrentDateTimeString = () => {
    const now = new Date();
    return now.toISOString(); // Example format: "2024-08-25T12:34:56.789Z"
};

const Notes = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [editNoteId, setEditNoteId] = useState(null);
    const [versions, setVersions] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const querySnapshot = await getDocs(collection(db, "categories"));
            setCategories(querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })));
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (!selectedCategoryId) return;

        const categoryRef = doc(db, "categories", selectedCategoryId);

        const unsubscribe = onSnapshot(collection(categoryRef, "notes"), (snapshot) => {
            setNotes(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });

        return () => unsubscribe();
    }, [selectedCategoryId]);

    useEffect(() => {
        if (!editNoteId || !selectedCategoryId) return;

        const noteRef = doc(db, "categories", selectedCategoryId, "notes", editNoteId);

        const unsubscribe = onSnapshot(collection(noteRef, "versions"), (snapshot) => {
            setVersions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });

        return () => unsubscribe();
    }, [editNoteId, selectedCategoryId]);

    const addNote = async () => {
        if (newNote.trim() === "" || !selectedCategoryId) return;

        const categoryRef = doc(db, "categories", selectedCategoryId);
        await addDoc(collection(categoryRef, "notes"), {
            text: newNote,
            createdAt: getCurrentDateTimeString(),
            updatedAt: getCurrentDateTimeString(),
        });
        setNewNote("");
    };

    const addCategory = async () => {
        if (newCategory.trim() === "") return;

        await addDoc(collection(db, "categories"), {
            name: newCategory,
        });
        setNewCategory("");
    };

    const startEditNote = (noteId, noteText) => {
        setEditNoteId(noteId);
        setNewNote(noteText);
    };

    const saveEditNote = async () => {
        if (editNoteId) {
            const categoryRef = doc(db, "categories", selectedCategoryId);
            const noteRef = doc(collection(categoryRef, "notes"), editNoteId);

            // Fetch the current note data
            const noteSnapshot = await getDocs(noteRef);

            // Save the current version before updating
            await addDoc(collection(noteRef, "versions"), {
                text: noteSnapshot.data().text,
                versionTimestamp: getCurrentDateTimeString(),
            });

            // Update the note with the new text
            await updateDoc(noteRef, {
                text: newNote,
                updatedAt: getCurrentDateTimeString(),
            });

            setEditNoteId(null);
            setNewNote("");
        }
    };

    const deleteNote = async (noteId) => {
        const noteRef = doc(db, "categories", selectedCategoryId, "notes", noteId);
        await deleteDoc(noteRef);
    };

    const revertToVersion = async (versionId, noteId) => {
        const categoryRef = doc(db, "categories", selectedCategoryId);
        const noteRef = doc(collection(categoryRef, "notes"), noteId);
        const versionRef = doc(collection(noteRef, "versions"), versionId);

        const versionSnapshot = await getDocs(versionRef);

        if (versionSnapshot.exists()) {
            await updateDoc(noteRef, {
                text: versionSnapshot.data().text,
                updatedAt: getCurrentDateTimeString(),
            });
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Notes</h1>
            <div className="form-group">
                <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New Category"
                    className="form-control mb-3"
                />
                <button className="btn btn-secondary mb-3" onClick={addCategory}>Add Category</button>

                <select
                    className="form-control mb-3"
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    value={selectedCategoryId}
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>

                <input
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="New Note"
                    className="form-control mb-3"
                />
                {editNoteId ? (
                    <button className="btn btn-success mr-2" onClick={saveEditNote}>Save Note</button>
                ) : (
                    <button className="btn btn-primary mr-2" onClick={addNote}>Add Note</button>
                )}
            </div>

            <ul className="list-group mt-3">
                {notes.map((note) => (
                    <li key={note.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{note.text}</strong>
                            {versions.length > 0 && (
                                <div className="mt-2">
                                    <h5>Version History:</h5>
                                    <ul className="list-group">
                                        {versions.map(version => (
                                            <li key={version.id} className="list-group-item">
                                                <span>{version.versionTimestamp}</span>
                                                <button className="btn btn-link" onClick={() => revertToVersion(version.id, note.id)}>Revert</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div>
                            <button className="btn btn-warning btn-sm mr-2" onClick={() => startEditNote(note.id, note.text)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteNote(note.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notes;
