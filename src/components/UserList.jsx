import { useEffect, useState } from "react";

export default function UserList() {
    const [users, setUsers] = useState([]);

    // State for the Popup Window
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    // --- 1. FETCH USERS (Read) ---
    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const res = await fetch(`${API_URL}/api/user`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error("API did not return a list:", data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    // --- 2. DELETE USER ---
    async function handleDelete(id) {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const res = await fetch(`${API_URL}/api/user/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("delete failed");
            // Update UI immediately
            setUsers(users.filter(u => u._id !== id));
        } catch (error) {
            alert("Failed to delete user");
        }
    }

    // --- 3. MODAL FUNCTIONS (Open & Type) ---
    function openEditModal(user) {
        setEditingUser(user);
        setIsModalOpen(true);
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setEditingUser({ ...editingUser, [name]: value });
    }

    // --- 4. SAVE CHANGES (Update) ---
    async function saveUser() {
        try {
            const res = await fetch(`${API_URL}/api/user/${editingUser._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstname: editingUser.firstname,
                    lastname: editingUser.lastname,
                    email: editingUser.email,
                }),
            });

            if (res.ok) {
                // Update the list locally
                setUsers(users.map(u => (u._id === editingUser._id ? editingUser : u)));
                setIsModalOpen(false);
                alert("User updated successfully!");
            } else {
                const msg = await res.text();
                alert("Failed to update. " + msg);
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    }

    // --- HTML DISPLAY ---
    return (
        <div className="user-page">
            <div className="user-card">
                <div className="user-header">
                    <div>
                        <h2 style={{ margin: 0 }}>User Management</h2>
                        <p style={{ margin: 0, color: "#9ca3af", fontSize: 13 }}>Edit or remove existing accounts</p>
                    </div>
                    <button className="btn btn-primary" onClick={fetchUsers}>Refresh</button>
                </div>

                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="user-row">
                                <td>
                                    <div style={{ fontWeight: 700 }}>{user.firstname} {user.lastname}</div>
                                    <div style={{ fontSize: 12, color: "#9ca3af" }}>@{user.username}</div>
                                </td>
                                <td>{user.email}</td>
                                <td><span className="pill">{user.status || "ACTIVE"}</span></td>
                                <td style={{ textAlign: "right" }}>
                                    <button className="btn btn-ghost" onClick={() => openEditModal(user)}>Edit</button>
                                    &nbsp;
                                    <button className="btn btn-danger" onClick={() => handleDelete(user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ textAlign: "center", color: "#9ca3af", padding: "18px" }}>
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- EDIT POPUP WINDOW --- */}
            {isModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="user-header" style={{ marginBottom: 12 }}>
                            <h3 style={{ margin: 0 }}>Edit User</h3>
                            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Close</button>
                        </div>

                        <div className="form-grid">
                            <div className="field">
                                <label>First Name</label>
                                <input
                                    type="text" name="firstname"
                                    value={editingUser.firstname || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="field">
                                <label>Last Name</label>
                                <input
                                    type="text" name="lastname"
                                    value={editingUser.lastname || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="field">
                                <label>Email</label>
                                <input
                                    type="email" name="email"
                                    value={editingUser.email || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-primary" onClick={saveUser}>Save</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(editingUser._id)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
