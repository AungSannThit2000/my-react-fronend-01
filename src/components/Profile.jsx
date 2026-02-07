import { useUser } from "../context/UserProvider";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { logout } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [hasImage, setHasImage] = useState(false);
  const fileInputRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  async function onUpdateImage() {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(`${API_URL}/api/user/profile/image`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (response.ok) {
        fetchProfile();
      } else {
        alert("Failed to update image.");
      }
    } catch (err) {
      alert("Error uploading image.");
    }
  }

  async function fetchProfile() {
    try {
      const result = await fetch(`${API_URL}/api/user/profile`, {
        credentials: "include",
      });
      if (result.status === 401) {
        logout();
        return;
      }
      if (!result.ok) {
        console.log("Profile load failed:", result.status);
        return;
      }
      const data = await result.json();
      setHasImage(Boolean(data.profileImage));
      setData(data);
    } catch (err) {
      console.log("Profile fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div>
            <p className="eyebrow">Signed in</p>
            <h2>{data.firstname} {data.lastname}</h2>
            <p className="muted">{data.email}</p>
          </div>
          <div className="avatar">
            {hasImage ? (
              <img src={`${API_URL}${data.profileImage}`} alt="Profile" />
            ) : (
              <div className="avatar-fallback">{(data.firstname || "U")[0]}</div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="muted">Loading profile…</div>
        ) : (
          <div className="profile-grid">
            <div className="field">
              <label>User ID</label>
              <span>{data._id}</span>
            </div>
            <div className="field">
              <label>Status</label>
              <span className="pill">{data.status || "ACTIVE"}</span>
            </div>
            <div className="field">
              <label>First Name</label>
              <span>{data.firstname}</span>
            </div>
            <div className="field">
              <label>Last Name</label>
              <span>{data.lastname}</span>
            </div>
          </div>
        )}

        <div className="upload-row">
          <input type="file" ref={fileInputRef} />
          <button className="btn btn-primary" onClick={onUpdateImage}>
            Update Image
          </button>
        </div>

        <div className="profile-actions">
          <Link to="/users"><button className="btn btn-ghost">User Management</button></Link>
          <Link to="/logout"><button className="btn btn-danger">Logout</button></Link>
        </div>
      </div>
    </div>
  );
}
