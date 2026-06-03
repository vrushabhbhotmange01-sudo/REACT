import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { setTheme } from "../features/userSlice";
import { themes } from "../themes";

function FormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = useSelector((state) => state.user.username) || "john_doe";
  const themeName = useSelector((state) => state.user.theme) || "light";
  const currentTheme = themes[themeName];

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Mock list of employees to populate the table dynamically
  const [employees, setEmployees] = useState([
    { id: 1, name: "Sarah Connor", age: 29, department: "Engineering", status: "Active" },
    { id: 2, name: "Marcus Wright", age: 34, department: "Operations", status: "Active" },
    { id: 3, name: "John Connor", age: 22, department: "Management", status: "On Leave" }
  ]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    document.title = "Employee Dashboard";
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const iframeTheme = params.get("theme");

    if (iframeTheme && themes[iframeTheme]) {
      dispatch(setTheme(iframeTheme));
    }
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Employee name is required.";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!age) {
      newErrors.age = "Age is required.";
    } else {
      const parsedAge = parseInt(age, 10);
      if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 100) {
        newErrors.age = "Age must be a valid number between 18 and 100.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      addToast("Please correct the errors in the form.", "error");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      formName: "EmployeeForm",
      username: username,
      formData: {
        name: name.trim(),
        age: parseInt(age, 10)
      }
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/submit-form",
        payload
      );

      addToast(response.data.message || "Form submitted successfully!", "success");
      
      // Add the submitted employee to the local dashboard table
      const newEmployee = {
        id: Date.now(),
        name: name.trim(),
        age: parseInt(age, 10),
        department: "Marketing", // mock default department
        status: "Active"
      };
      setEmployees((prev) => [newEmployee, ...prev]);

      // Reset form
      setName("");
      setAge("");
      setErrors({});
    } catch (error) {
      addToast(
        error.response?.data?.message || 
        "Form submission failed. Please try again.", 
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const themeStyles = {
    "--theme-bg": currentTheme.background,
    "--theme-text": currentTheme.text,
    "--theme-secondary-text": currentTheme.secondaryText,
    "--theme-button": currentTheme.button,
    "--theme-button-text": currentTheme.buttonText,
    "--theme-card-bg": currentTheme.cardBackground,
    "--theme-card-border": currentTheme.cardBorder,
    "--theme-input-bg": currentTheme.inputBackground,
    "--theme-input-border": currentTheme.inputBorder,
    "--theme-input-text": currentTheme.inputText,
    "--theme-shadow": currentTheme.shadow,
    "--theme-accent": currentTheme.accent,
    "--theme-accent-light": currentTheme.accentLight,
  };

  return (
    <div className="app-layout" style={themeStyles}>
      <div 
        className="bg-gradient-mesh" 
        style={{
          "--bg-fallback": currentTheme.background, 
          "--accent-light": currentTheme.accentLight
        }} 
      />
      <div className="dashboard-container animate-fade-in">
        
        {/* Dashboard Header */}
        <header className="dashboard-header">
          <div className="user-badge">
            <div className="user-avatar">
              {username.substring(0, 2).toUpperCase()}
            </div>
            <div className="user-info">
              <h1>Employee Hub</h1>
              <p>Logged in as <strong>{username}</strong></p>
            </div>
          </div>

          <div className="header-actions">
            {/* Theme selector pills */}
            <div className="theme-selector">
              {Object.keys(themes).map((tName) => (
                <button
                  key={tName}
                  className={`theme-pill ${themeName === tName ? "active" : ""}`}
                  onClick={() => dispatch(setTheme(tName))}
                >
                  {tName.charAt(0).toUpperCase() + tName.slice(1)}
                </button>
              ))}
            </div>

            {/* Logout button */}
            <button className="btn-secondary" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content Grid */}
        <div className="dashboard-grid">
          
          {/* Left Column: Form Card */}
          <section className="card animate-slide-up">
            <h2 className="card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Employee Registry</span>
            </h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="empName">Employee Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    id="empName"
                    type="text"
                    className="form-input"
                    placeholder="Jane Doe"
                    value={name}
                    disabled={isSubmitting}
                    onChange={(e) => setName(e.target.value)}
                    style={{ borderColor: errors.name ? "#ef4444" : "" }}
                  />
                </div>
                {errors.name && (
                  <span className="error-text">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="empAge">Age</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </span>
                  <input
                    id="empAge"
                    type="number"
                    className="form-input"
                    placeholder="25"
                    value={age}
                    disabled={isSubmitting}
                    onChange={(e) => setAge(e.target.value)}
                    style={{ borderColor: errors.age ? "#ef4444" : "" }}
                  />
                </div>
                {errors.age && (
                  <span className="error-text">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.age}
                  </span>
                )}
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isSubmitting}
                style={{ marginTop: "12px" }}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Form</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Right Column: Submitted Records Card */}
          <section className="card animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Submitted Records</span>
            </h2>

            <div className="table-container">
              {employees.length === 0 ? (
                <div className="no-data">
                  <div className="no-data-icon">📂</div>
                  <p>No employee records submitted yet.</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Department</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id}>
                        <td><strong>{emp.name}</strong></td>
                        <td>{emp.age}</td>
                        <td>{emp.department}</td>
                        <td>
                          <span 
                            style={{
                              backgroundColor: emp.status === "Active" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                              color: emp.status === "Active" ? "#10b981" : "#f59e0b",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600"
                            }}
                          >
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === "success" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="toast-success-icon">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="toast-error-icon">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            <span>{t.message}</span>
            <button 
              className="toast-close" 
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormPage;