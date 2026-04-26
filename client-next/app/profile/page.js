"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Calendar,
  Award,
  Link2,
  Github,
  Linkedin,
  Globe,
  Camera,
  Edit2,
  Save,
  X,
  Code,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API_URL from '@/lib/api';

const Profile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log(
        "Fetching profile with token:",
        token ? "Present" : "Missing",
      );
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          "x-auth-token": token,
        },
      });
      console.log("Profile response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Profile data received:", data);
        setProfile(data);
        setFormData(data);
      } else {
        console.error("Failed to fetch profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Username validation
    if (name === "username") {
      const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
      if (value && !usernameRegex.test(value)) {
        setUsernameError(
          "Username must be 3-30 characters and contain only letters, numbers, and underscores",
        );
      } else {
        setUsernameError("");
      }
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (e, field) => {
    const items = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (usernameError) {
      setMessage({ type: "error", text: usernameError });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data);
        setFormData(data);
        setEditing(false);
        setEditSection(null);
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to update profile",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong" });
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("avatar", file);

    try {
      const response = await fetch(`${API_URL}/api/users/me/avatar`, {
        method: "POST",
        headers: {
          "x-auth-token": token,
        },
        body: formDataUpload,
      });

      if (response.ok) {
        const updated = await response.json();
        setProfile(updated);
        setMessage({ type: "success", text: "Avatar updated successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to upload avatar" });
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <h2>Unable to load profile</h2>
        <p>Please try refreshing the page or logging in again.</p>
      </div>
    );
  }

  const remainingUsernameChanges = 2 - (profile.usernameChangeCount || 0);

  return (
    <div className="profile-page">
      <div className="profile-container">
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`message-alert ${message.type}`}
            >
              {message.type === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="profile-grid">
          {/* Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="profile-sidebar"
          >
            <div className="profile-avatar-section">
              <div className="avatar-wrapper">
                <div className="avatar-container">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      <User size={60} />
                    </div>
                  )}
                </div>
                <label htmlFor="avatar-upload" className="avatar-upload-btn">
                  <Camera size={18} />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>

              <h2 className="profile-name">{profile.name}</h2>
              {profile.username && (
                <p className="profile-username">@{profile.username}</p>
              )}

              <div className="profile-role-badge">
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </div>

              {profile.institution && (
                <div className="profile-info-item">
                  <Building2 size={16} />
                  <span>{profile.institution}</span>
                </div>
              )}

              {profile.branch && (
                <div className="profile-info-item">
                  <BookOpen size={16} />
                  <span>
                    {profile.branch} {profile.batch && `• ${profile.batch}`}
                  </span>
                </div>
              )}

              <div className="profile-info-item">
                <Mail size={16} />
                <span className="profile-email">{profile.email}</span>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="profile-main">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="profile-section"
            >
              <div className="section-header">
                <h3>Personal Information</h3>
                {editSection !== "personal" ? (
                  <button
                    onClick={() => setEditSection("personal")}
                    className="btn-edit"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                ) : (
                  <div className="btn-group">
                    <button onClick={handleSubmit} className="btn-save">
                      <Save size={16} /> Save
                    </button>
                    <button
                      onClick={() => {
                        setEditSection(null);
                        setFormData(profile);
                        setUsernameError("");
                      }}
                      className="btn-cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {editSection === "personal" ? (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Username
                      {profile.username && (
                        <span className="username-changes-badge">
                          {remainingUsernameChanges}{" "}
                          {remainingUsernameChanges === 1
                            ? "change"
                            : "changes"}{" "}
                          left
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username || ""}
                      onChange={handleInputChange}
                      placeholder="your_username"
                      className={usernameError ? "input-error" : ""}
                      disabled={
                        remainingUsernameChanges === 0 && profile.username
                      }
                    />
                    {usernameError && (
                      <span className="error-text">{usernameError}</span>
                    )}
                    <span className="helper-text">
                      3-30 characters, letters, numbers, and underscores only
                    </span>
                  </div>
                  <div className="form-group full-width">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio || ""}
                      onChange={handleInputChange}
                      maxLength={250}
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                    <span className="char-count">
                      {formData.bio?.length || 0}/250
                    </span>
                  </div>
                </div>
              ) : (
                <div className="info-display">
                  <div className="info-item">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">
                      {profile.name || "Not provided"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Username</span>
                    <span className="info-value">
                      {profile.username || "Not set"}
                    </span>
                  </div>
                  <div className="info-item full-width">
                    <span className="info-label">Bio</span>
                    <span className="info-value">
                      {profile.bio || "No bio added yet."}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Academic Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="profile-section"
            >
              <div className="section-header">
                <h3>Academic Details</h3>
                {editSection !== "academic" ? (
                  <button
                    onClick={() => setEditSection("academic")}
                    className="btn-edit"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                ) : (
                  <div className="btn-group">
                    <button onClick={handleSubmit} className="btn-save">
                      <Save size={16} /> Save
                    </button>
                    <button
                      onClick={() => {
                        setEditSection(null);
                        setFormData(profile);
                      }}
                      className="btn-cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {editSection === "academic" ? (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Institution</label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution || ""}
                      onChange={handleInputChange}
                      placeholder="Your college/school name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Branch/Department</label>
                    <input
                      type="text"
                      name="branch"
                      value={formData.branch || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div className="form-group">
                    <label>Batch/Year</label>
                    <input
                      type="text"
                      name="batch"
                      value={formData.batch || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., 2024"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Semester</label>
                    <input
                      type="number"
                      name="semester"
                      value={formData.semester || ""}
                      onChange={handleInputChange}
                      min="1"
                      max="12"
                      placeholder="Current semester"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Subjects (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.subjects?.join(", ") || ""}
                      onChange={(e) => handleArrayChange(e, "subjects")}
                      placeholder="e.g., DBMS, Operating Systems, AI"
                    />
                  </div>
                </div>
              ) : (
                <div className="info-display academic-grid">
                  <div className="info-item">
                    <span className="info-label">Institution</span>
                    <span className="info-value">
                      {profile.institution || "Not provided"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Branch</span>
                    <span className="info-value">
                      {profile.branch || "Not provided"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Batch</span>
                    <span className="info-value">
                      {profile.batch || "Not provided"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Semester</span>
                    <span className="info-value">
                      {profile.semester || "Not provided"}
                    </span>
                  </div>
                  <div className="info-item full-width">
                    <span className="info-label">Subjects</span>
                    <div className="chips-container">
                      {profile.subjects && profile.subjects.length > 0 ? (
                        profile.subjects.map((subject, idx) => (
                          <span key={idx} className="chip subject-chip">
                            {subject}
                          </span>
                        ))
                      ) : (
                        <span className="info-value">No subjects added</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="profile-section"
            >
              <div className="section-header">
                <h3>
                  <Code size={20} /> Skills & Expertise
                </h3>
                {editSection !== "skills" ? (
                  <button
                    onClick={() => setEditSection("skills")}
                    className="btn-edit"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                ) : (
                  <div className="btn-group">
                    <button onClick={handleSubmit} className="btn-save">
                      <Save size={16} /> Save
                    </button>
                    <button
                      onClick={() => {
                        setEditSection(null);
                        setFormData(profile);
                      }}
                      className="btn-cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {editSection === "skills" ? (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Your Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.skills?.join(", ") || ""}
                      onChange={(e) => handleArrayChange(e, "skills")}
                      placeholder="e.g., JavaScript, React, Python, Machine Learning"
                    />
                    <span className="helper-text">
                      Add technical skills, tools, or technologies you know
                    </span>
                  </div>
                </div>
              ) : (
                <div className="skills-display">
                  {profile.skills && profile.skills.length > 0 ? (
                    <div className="chips-container">
                      {profile.skills.map((skill, idx) => (
                        <span key={idx} className="chip skill-chip">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">
                      No skills added yet. Add your skills to showcase your
                      expertise!
                    </p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Contact & Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="profile-section"
            >
              <div className="section-header">
                <h3>Contact & Social Links</h3>
                {editSection !== "contact" ? (
                  <button
                    onClick={() => setEditSection("contact")}
                    className="btn-edit"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                ) : (
                  <div className="btn-group">
                    <button onClick={handleSubmit} className="btn-save">
                      <Save size={16} /> Save
                    </button>
                    <button
                      onClick={() => {
                        setEditSection(null);
                        setFormData(profile);
                      }}
                      className="btn-cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {editSection === "contact" ? (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>LinkedIn</label>
                    <input
                      type="url"
                      name="socialLinks.linkedin"
                      value={formData.socialLinks?.linkedin || ""}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>GitHub</label>
                    <input
                      type="url"
                      name="socialLinks.github"
                      value={formData.socialLinks?.github || ""}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Personal Website</label>
                    <input
                      type="url"
                      name="socialLinks.website"
                      value={formData.socialLinks?.website || ""}
                      onChange={handleInputChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              ) : (
                <div className="info-display">
                  {profile.phoneNumber && (
                    <div className="info-item">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{profile.phoneNumber}</span>
                    </div>
                  )}
                  <div className="info-item full-width">
                    <span className="info-label">Social Links</span>
                    <div className="social-links">
                      {profile.socialLinks?.linkedin && (
                        <a
                          href={profile.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                        >
                          <Linkedin size={18} /> LinkedIn
                        </a>
                      )}
                      {profile.socialLinks?.github && (
                        <a
                          href={profile.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                        >
                          <Github size={18} /> GitHub
                        </a>
                      )}
                      {profile.socialLinks?.website && (
                        <a
                          href={profile.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                        >
                          <Globe size={18} /> Website
                        </a>
                      )}
                      {!profile.socialLinks?.linkedin &&
                        !profile.socialLinks?.github &&
                        !profile.socialLinks?.website && (
                          <span className="info-value">
                            No social links added
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .profile-page {
          min-height: 100vh;
          background: var(--background);
          padding: 2rem 0;
        }

        .profile-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .message-alert {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .message-alert.success {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .message-alert.error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 2rem;
        }

        .profile-sidebar {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .profile-avatar-section {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .avatar-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .avatar-container {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid var(--primary);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .avatar-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .avatar-upload-btn {
          position: absolute;
          bottom: 5px;
          right: 5px;
          background: var(--primary);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .avatar-upload-btn:hover {
          transform: scale(1.1);
          background: var(--primary-dark);
        }

        .avatar-upload-btn input {
          display: none;
        }

        .profile-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: var(--text-main);
        }

        .profile-username {
          color: var(--text-muted);
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }

        .profile-role-badge {
          display: inline-block;
          background: linear-gradient(135deg, var(--primary-light), var(--primary));
          color: white;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .profile-info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: var(--background);
          border-radius: 8px;
          margin-bottom: 0.5rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .profile-email {
          word-break: break-all;
        }

        .profile-main {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-section {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--border);
        }

        .section-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-main);
        }

        .btn-edit, .btn-save, .btn-cancel {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
        }

        .btn-edit {
          background: var(--background);
          color: var(--text-main);
          border: 1px solid var(--border);
        }

        .btn-edit:hover {
          background: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
        }

        .btn-save {
          background: var(--primary);
          color: white;
        }

        .btn-save:hover {
          background: var(--primary-dark);
        }

        .btn-cancel {
          background: transparent;
          color: var(--text-muted);
          border: 1px solid var(--border);
        }

        .btn-cancel:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: #ef4444;
        }

        .btn-group {
          display: flex;
          gap: 0.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-group input,
        .form-group textarea {
          padding: 0.75rem;
          border-radius: 8px;
          border: 2px solid var(--border);
          background: var(--background);
          color: var(--text-main);
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
        }

        .form-group input.input-error {
          border-color: #ef4444;
        }

        .form-group input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .helper-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .error-text {
          font-size: 0.8rem;
          color: #ef4444;
          margin-top: 0.25rem;
        }

        .char-count {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-align: right;
          margin-top: 0.25rem;
        }

        .username-changes-badge {
          background: var(--primary-light);
          color: var(--primary);
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-left: 0.5rem;
        }

        .info-display {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .info-display.academic-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .info-item {
          display: flex;
          flex-direction: column;
        }

        .info-item.full-width {
          grid-column: 1 / -1;
        }

        .info-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .info-value {
          color: var(--text-main);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .chips-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .chip {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .subject-chip {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .skill-chip {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .skills-display {
          padding: 1rem 0;
        }

        .empty-state {
          color: var(--text-muted);
          text-align: center;
          padding: 2rem;
          font-style: italic;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--background);
          border-radius: 8px;
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 1px solid var(--border);
        }

        .social-link:hover {
          background: var(--primary-light);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }

          .profile-sidebar {
            position: relative;
            top: 0;
          }

          .form-grid,
          .info-display {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
