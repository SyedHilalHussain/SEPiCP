// frontend/src/api/surveyApi.js
const BASE = "http://127.0.0.1:8080/api";

function authHeaders() {
  const token = localStorage.getItem("access");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ── Instructor ────────────────────────────────────────────────────────────────

export async function submitInstructorSurvey(data) {
  const res = await fetch(`${BASE}/survey/instructor/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json; // { id, course_code, status, ... }
}

export async function publishInstructorSurvey(surveyId) {
  const res = await fetch(`${BASE}/survey/instructor/${surveyId}/publish/`, {
    method: "POST",
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json; // { message, course_code }
}

export async function getMyInstructorSurveys() {
  const res = await fetch(`${BASE}/survey/instructor/`, {
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function updateInstructorSurvey(surveyId, data) {
  const res = await fetch(`${BASE}/survey/instructor/${surveyId}/`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

// ── Student (anonymous) ───────────────────────────────────────────────────────

export async function lookupCourseCode(courseCode) {
  const res = await fetch(`${BASE}/survey/student/lookup/?course_code=${encodeURIComponent(courseCode)}`);
  const json = await res.json();
  if (!res.ok) throw json;
  return json; // { survey_id, course_code, instructor_name, course_name, department, semester }
}

export async function submitStudentSurvey(data) {
  const res = await fetch(`${BASE}/survey/student/submit/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json; // { message, edit_token }
}

export async function loadStudentSurvey(token) {
  return getStudentSurveyByToken(token);
}

export async function getStudentSurveyByToken(token) {
  const res = await fetch(`${BASE}/survey/student/edit/${token}/`);
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function updateStudentSurvey(token, data) {
  const res = await fetch(`${BASE}/survey/student/edit/${token}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function getAllSurveysAdmin() {
  const res = await fetch(`${BASE}/admin/surveys/`, {
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}
