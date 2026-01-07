"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import styles from "./profile.module.css";

const COURSE_MAP = {
  BTECH: "B.Tech",
  MTECH: "M.Tech",
  BARCH: "B.Arch",
};

const DEPT_MAP = {
  AEAM: "Aerospace Engineering & Applied Mechanics",
  CE: "Civil Engineering",
  CST: "Computer Science & Technology",
  EE: "Electrical Engineering",
  ETC: "Electronics & Telecommunication Engineering",
  IT: "Information Technology",
  ME: "Mechanical Engineering",
  MIN: "Mining Engineering",
  MME: "Metallurgy & Materials Engineering",
};

const YEAR_MAP = {
  ONE: "First Year",
  TWO: "Second Year",
  THREE: "Third Year",
  FOUR: "Fourth Year",
  FIVE: "Fifth Year",
};

const SEM_MAP = {
  S1: "1",
  S2: "2",
  S3: "3",
  S4: "4",
  S5: "5",
  S6: "6",
  S7: "7",
  S8: "8",
};

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    course: "",
    department: "",
    year: "",
    semester: "",
    enrollmentNumber: "",
  });

  const [originalForm, setOriginalForm] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiFetch("/api/profile/me");
      if (res?.status === 401 || res?.status === 403) return;

      const data = res?.data || {};
      const mapped = {
        fullName: data.fullName || "",
        course: data.course || "",
        department: data.department || "",
        year: data.year || "",
        semester: data.semester || "",
        enrollmentNumber: data.enrollmentNumber || "",
      };
      setForm(mapped);
      setOriginalForm(mapped);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    for (const key in form) {
      if (!form[key] || form[key].toString().trim() === "") return false;
    }
    return true;
  };

  const saveProfile = async () => {
    if (!validate()) {
      setError("All fields are required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await apiFetch("/api/profile", {
        method: "POST",
        body: {
          ...form,
          year: form.year,
          semester: form.semester,
        },
      });

      if (res?.data?.success) {
        setEditing(false);
        setOriginalForm({ ...form });
      } else {
        setError("Failed to save profile");
      }
    } catch (err) {
      console.error("Save failed", err);
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setForm({ ...originalForm });
    setEditing(false);
    setError(null);
  };

  if (loading) {
    return <p className={styles.loading}>Loading profile...</p>;
  }

  const displayValue = (field, value) => {
    switch (field) {
      case "course":
        return COURSE_MAP[value] || value;
      case "department":
        return DEPT_MAP[value] || value;
      case "year":
        return YEAR_MAP[value] || value;
      case "semester":
        return SEM_MAP[value] || value;
      default:
        return value;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Candidate Profile</h1>
      <p className={styles.subtitle}>
        Completing your profile helps generate accurate exam reports. It is not
        mandatory to attempt exams.
      </p>

      {error && <p className={styles.error}>{error}</p>}

      {!editing && (
        <div className={styles.viewMode}>
          <p><strong>Full Name:</strong> {displayValue("fullName", form.fullName)}</p>
          <p><strong>Course:</strong> {displayValue("course", form.course)}</p>
          <p><strong>Department:</strong> {displayValue("department", form.department)}</p>
          <p><strong>Year:</strong> {displayValue("year", form.year)}</p>
          <p><strong>Semester:</strong> {displayValue("semester", form.semester)}</p>
          <p><strong>Enrollment Number:</strong> {displayValue("enrollmentNumber", form.enrollmentNumber)}</p>

          <button
            className={styles.editBtn}
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      )}

      {editing && (
        <div className={styles.form}>
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
          />

          <select name="course" value={form.course} onChange={handleChange}>
            {Object.entries(COURSE_MAP).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select name="department" value={form.department} onChange={handleChange}>
            {Object.entries(DEPT_MAP).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select name="year" value={form.year} onChange={handleChange}>
            {Object.entries(YEAR_MAP).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select name="semester" value={form.semester} onChange={handleChange}>
            {Object.entries(SEM_MAP).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <input
            name="enrollmentNumber"
            placeholder="Enrollment Number e.g. 2023EEB005"
            value={form.enrollmentNumber}
            onChange={handleChange}
          />

          <div className={styles.buttonRow}>
            <button
              className={styles.saveBtn}
              onClick={saveProfile}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
            <button
              className={styles.cancelBtn}
              onClick={cancelEdit}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}