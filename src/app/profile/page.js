"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { Edit, Save, X, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        course: data.profile.course || "",
        department: data.profile.department || "",
        year: data.profile.year || "",
        semester: data.profile.semester || "",
        enrollmentNumber: data.profile.enrollmentNumber || "",
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
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
              <User className="w-6 h-6 text-[var(--color-primary-text)]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Candidate Profile</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Completing your profile helps generate accurate exam reports. It is not
            mandatory to attempt exams.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {!editing && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="text-gray-900 font-medium">{displayValue("fullName", form.fullName) || "Not set"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Course</p>
                  <p className="text-gray-900 font-medium">{displayValue("course", form.course) || "Not set"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Department</p>
                  <p className="text-gray-900 font-medium">{displayValue("department", form.department) || "Not set"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Year</p>
                  <p className="text-gray-900 font-medium">{displayValue("year", form.year) || "Not set"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Semester</p>
                  <p className="text-gray-900 font-medium">{displayValue("semester", form.semester) || "Not set"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Enrollment Number</p>
                  <p className="text-gray-900 font-medium">{displayValue("enrollmentNumber", form.enrollmentNumber) || "Not set"}</p>
                </div>
              </div>

              <button
                onClick={() => setEditing(true)}
                style={{ backgroundColor: "var(--color-primary)" }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-900 hover:opacity-90 transition"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          )}

          {editing && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                <input
                  name="fullName"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Course</label>
                <select 
                  name="course" 
                  value={form.course} 
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="">Select Course</option>
                  {Object.entries(COURSE_MAP).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Department</label>
                <select 
                  name="department" 
                  value={form.department} 
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="">Select Department</option>
                  {Object.entries(DEPT_MAP).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Year</label>
                <select 
                  name="year" 
                  value={form.year} 
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="">Select Year</option>
                  {Object.entries(YEAR_MAP).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Semester</label>
                <select 
                  name="semester" 
                  value={form.semester} 
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="">Select Semester</option>
                  {Object.entries(SEM_MAP).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Enrollment Number</label>
                <input
                  name="enrollmentNumber"
                  placeholder="Enrollment Number e.g. 2023EEB005"
                  value={form.enrollmentNumber}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  style={{ backgroundColor: "var(--color-primary)" }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-900 hover:opacity-90 transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Profile"}
                </button>
                
                <button
                  onClick={cancelEdit}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}