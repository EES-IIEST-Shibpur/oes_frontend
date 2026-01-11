"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile, useUpdateProfile } from "@/hooks/useApi";
import { Edit, Save, X, User, CheckCircle, AlertCircle } from "lucide-react";
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

  const { data: profileRes, isLoading, error: fetchError } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editing, setEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    id: null,
    email: "",
    fullName: "",
    emailVerified: false,
    profileComplete: false,
    profile: null,
  });

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
    if (profileRes?.data?.data) {
      const data = profileRes.data.data;
      setProfileData(data);

      const mapped = {
        fullName: data.fullName || "",
        course: data.profile?.course || "",
        department: data.profile?.department || "",
        year: data.profile?.year || "",
        semester: data.profile?.semester || "",
        enrollmentNumber: data.profile?.enrollmentNumber || "",
      };
      setForm(mapped);
      setOriginalForm(mapped);
    }
  }, [profileRes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (form.fullName.trim().length < 3) {
      setError("Full name must be at least 3 characters");
      return false;
    }

    if (!form.course) {
      setError("Course is required");
      return false;
    }

    if (!form.department) {
      setError("Department is required");
      return false;
    }

    if (!form.year) {
      setError("Year is required");
      return false;
    }

    if (!form.semester) {
      setError("Semester is required");
      return false;
    }

    if (!form.enrollmentNumber.trim()) {
      setError("Enrollment number is required");
      return false;
    }
    if (form.enrollmentNumber.trim().length < 3) {
      setError("Enrollment number must be at least 3 characters");
      return false;
    }

    return true;
  };

  const saveProfile = async () => {
    if (!validateForm()) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const res = await updateProfileMutation.mutateAsync({
        fullName: form.fullName.trim(),
        course: form.course,
        department: form.department,
        year: form.year,
        semester: form.semester,
        enrollmentNumber: form.enrollmentNumber.trim(),
      });

      if (res?.status === 200 && res?.data?.data) {
        const data = res.data.data;
        setProfileData(data);
        setOriginalForm({ ...form });
        setEditing(false);
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(res?.data?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Save failed", err);
      setError("Failed to save profile. Please try again.");
    }
  };

  const cancelEdit = () => {
    setForm({ ...originalForm });
    setEditing(false);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
          {/* Header Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border border-gray-200 rounded-full bg-gray-100 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-56 animate-pulse"></div>
                </div>
              </div>
              <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mt-2 animate-pulse"></div>
          </div>

          {/* Profile Completion Bar Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gray-200 rounded-full w-2/3 animate-pulse"></div>
            </div>
          </div>

          {/* Profile Details Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
            </div>

            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-gray-100 rounded-lg w-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const displayValue = (field, value) => {
    if (!value) return "Not set";
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

  const getProfileCompletionPercentage = () => {
    const fields = [
      form.fullName,
      form.course,
      form.department,
      form.year,
      form.semester,
      form.enrollmentNumber,
    ];
    const filledFields = fields.filter((f) => f && f.toString().trim() !== "").length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = getProfileCompletionPercentage();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border border-(--color-primary-text) rounded-full  flex items-center justify-center">
                <User className="w-8 h-8 text-(--color-primary-text)" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {profileData.fullName || "User"}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {profileData.email}
                </p>
              </div>
            </div>
            {profileData.profileComplete && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Complete</span>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm">
            Complete your profile to ensure accurate exam records and personalized reports. All fields are required.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Profile Completion Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">Profile Completion</p>
            <span className="text-sm font-semibold text-gray-900">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-(--color-primary-text) h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Profile Display Mode */}
        {!editing && (
          <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Full Name */}
              <div className="pb-4 border-b md:border-b-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Full Name
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {form.fullName || "Not set"}
                </p>
              </div>

              {/* Email */}
              <div className="pb-4 border-b md:border-b-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Email
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {profileData.email}
                </p>
              </div>

              {/* Course */}
              <div className="pb-4 border-b md:border-b-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Course
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {displayValue("course", form.course)}
                </p>
              </div>

              {/* Department */}
              <div className="pb-4 border-b md:border-b-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Department
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {displayValue("department", form.department)}
                </p>
              </div>

              {/* Year */}
              <div className="pb-4 border-b md:border-b-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Year
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {displayValue("year", form.year)}
                </p>
              </div>

              {/* Semester */}
              <div className="pb-4 border-b md:border-b-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Semester
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {displayValue("semester", form.semester)}
                </p>
              </div>

              {/* Enrollment Number */}
              <div className="pb-4 border-b md:border-b-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Enrollment Number
                </p>
                <p className="text-lg font-semibold text-gray-900 font-mono">
                  {form.enrollmentNumber || "Not set"}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditing(true);
                setError(null);
              }}
              style={{ backgroundColor: "var(--color-primary)" }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-gray-900 hover:opacity-90 transition cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        )}

        {/* Profile Edit Mode */}
        {editing && (
          <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Edit Profile</h2>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="fullName"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 3 characters required</p>
              </div>

              {/* Course */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course <span className="text-red-500">*</span>
                </label>
                <select
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Course</option>
                  {Object.entries(COURSE_MAP).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  {Object.entries(DEPT_MAP).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year and Semester in Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Year</option>
                    {Object.entries(YEAR_MAP).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="semester"
                    value={form.semester}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Semester</option>
                    {Object.entries(SEM_MAP).map(([key, label]) => (
                      <option key={key} value={key}>
                        Semester {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Enrollment Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enrollment Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="enrollmentNumber"
                  placeholder="e.g. 2023EEB005"
                  value={form.enrollmentNumber}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 3 characters required</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6 border-t">
                <button
                  onClick={saveProfile}
                  disabled={updateProfileMutation.isPending}
                  style={{ backgroundColor: "var(--color-primary)" }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-gray-900 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                </button>

                <button
                  onClick={cancelEdit}
                  disabled={updateProfileMutation.isPending}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

// export default function ProfilePage() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [editing, setEditing] = useState(false);

//   const [form, setForm] = useState({
//     fullName: "",
//     course: "",
//     department: "",
//     year: "",
//     semester: "",
//     enrollmentNumber: "",
//   });

//   const [originalForm, setOriginalForm] = useState({});

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const res = await apiFetch("/api/profile/me");
//       if (res?.status === 401 || res?.status === 403) return;

//       const data = res?.data || {};
//       const mapped = {
//         fullName: data.fullName || "",
//         course: data.profile.course || "",
//         department: data.profile.department || "",
//         year: data.profile.year || "",
//         semester: data.profile.semester || "",
//         enrollmentNumber: data.profile.enrollmentNumber || "",
//       };
//       setForm(mapped);
//       setOriginalForm(mapped);
//     } catch (err) {
//       console.error("Failed to fetch profile", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const validate = () => {
//     for (const key in form) {
//       if (!form[key] || form[key].toString().trim() === "") return false;
//     }
//     return true;
//   };

//   const saveProfile = async () => {
//     if (!validate()) {
//       setError("All fields are required");
//       return;
//     }

//     setSaving(true);
//     setError(null);

//     try {
//       const res = await apiFetch("/api/profile", {
//         method: "POST",
//         body: {
//           ...form,
//           year: form.year,
//           semester: form.semester,
//         },
//       });

//       if (res?.data?.success) {
//         setEditing(false);
//         setOriginalForm({ ...form });
//       } else {
//         setError("Failed to save profile");
//       }
//     } catch (err) {
//       console.error("Save failed", err);
//       setError("Failed to save profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const cancelEdit = () => {
//     setForm({ ...originalForm });
//     setEditing(false);
//     setError(null);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50">
//         <Navbar />
//         <div className="flex-1 flex items-center justify-center">
//           <p className="text-gray-600">Loading profile...</p>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   const displayValue = (field, value) => {
//     switch (field) {
//       case "course":
//         return COURSE_MAP[value] || value;
//       case "department":
//         return DEPT_MAP[value] || value;
//       case "year":
//         return YEAR_MAP[value] || value;
//       case "semester":
//         return SEM_MAP[value] || value;
//       default:
//         return value;
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Navbar />
      
//       <div className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
//         <div className="bg-white rounded-xl shadow-sm border p-8">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="w-12 h-12 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
//               <User className="w-6 h-6 text-[var(--color-primary-text)]" />
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900">Candidate Profile</h1>
//           </div>
          
//           <p className="text-gray-600 mb-8">
//             Completing your profile helps generate accurate exam reports. It is not
//             mandatory to attempt exams.
//           </p>

//           {error && (
//             <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
//               {error}
//             </div>
//           )}

//           {!editing && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Full Name</p>
//                   <p className="text-gray-900 font-medium">{displayValue("fullName", form.fullName) || "Not set"}</p>
//                 </div>
                
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Course</p>
//                   <p className="text-gray-900 font-medium">{displayValue("course", form.course) || "Not set"}</p>
//                 </div>
                
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Department</p>
//                   <p className="text-gray-900 font-medium">{displayValue("department", form.department) || "Not set"}</p>
//                 </div>
                
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Year</p>
//                   <p className="text-gray-900 font-medium">{displayValue("year", form.year) || "Not set"}</p>
//                 </div>
                
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Semester</p>
//                   <p className="text-gray-900 font-medium">{displayValue("semester", form.semester) || "Not set"}</p>
//                 </div>
                
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Enrollment Number</p>
//                   <p className="text-gray-900 font-medium">{displayValue("enrollmentNumber", form.enrollmentNumber) || "Not set"}</p>
//                 </div>
//               </div>

//               <button
//                 onClick={() => setEditing(true)}
//                 style={{ backgroundColor: "var(--color-primary)" }}
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-900 hover:opacity-90 transition"
//               >
//                 <Edit className="w-4 h-4" />
//                 Edit Profile
//               </button>
//             </div>
//           )}

//           {editing && (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Full Name</label>
//                 <input
//                   name="fullName"
//                   placeholder="Full Name"
//                   value={form.fullName}
//                   onChange={handleChange}
//                   className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Course</label>
//                 <select 
//                   name="course" 
//                   value={form.course} 
//                   onChange={handleChange}
//                   className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
//                 >
//                   <option value="">Select Course</option>
//                   {Object.entries(COURSE_MAP).map(([key, label]) => (
//                     <option key={key} value={key}>{label}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Department</label>
//                 <select 
//                   name="department" 
//                   value={form.department} 
//                   onChange={handleChange}
//                   className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
//                 >
//                   <option value="">Select Department</option>
//                   {Object.entries(DEPT_MAP).map(([key, label]) => (
//                     <option key={key} value={key}>{label}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Year</label>
//                 <select 
//                   name="year" 
//                   value={form.year} 
//                   onChange={handleChange}
//                   className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
//                 >
//                   <option value="">Select Year</option>
//                   {Object.entries(YEAR_MAP).map(([key, label]) => (
//                     <option key={key} value={key}>{label}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Semester</label>
//                 <select 
//                   name="semester" 
//                   value={form.semester} 
//                   onChange={handleChange}
//                   className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
//                 >
//                   <option value="">Select Semester</option>
//                   {Object.entries(SEM_MAP).map(([key, label]) => (
//                     <option key={key} value={key}>{label}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Enrollment Number</label>
//                 <input
//                   name="enrollmentNumber"
//                   placeholder="Enrollment Number e.g. 2023EEB005"
//                   value={form.enrollmentNumber}
//                   onChange={handleChange}
//                   className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
//                 />
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button
//                   onClick={saveProfile}
//                   disabled={saving}
//                   style={{ backgroundColor: "var(--color-primary)" }}
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-900 hover:opacity-90 transition disabled:opacity-50"
//                 >
//                   <Save className="w-4 h-4" />
//                   {saving ? "Saving..." : "Save Profile"}
//                 </button>
                
//                 <button
//                   onClick={cancelEdit}
//                   disabled={saving}
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
//                 >
//                   <X className="w-4 h-4" />
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
      
//       <Footer />
//     </div>
//   );
// }