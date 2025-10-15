const API_BASE_URL = 'http://localhost:8080/api';
const USER = localStorage.getItem('user') || '';
const TOKEN = USER ? JSON.parse(USER).token : '';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TOKEN}`,
}
export const getStudents = async () => {
  try {
    console.log("TOKEN",TOKEN)
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'GET',
      headers: headers,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi gọi API getStudents:', error);
    throw error;
  }
};
export const getStudentById = async (studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: 'GET',
      headers: headers,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi gọi API getStudentById:', error);
    throw error;
  }
};
export const createStudent = async (studentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(studentData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi gọi API createStudent:', error);
    throw error;
  }
};
export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(studentData),
    });
    const data = await response.json();
    console.log("data",data)
    return data;
  } catch (error) {
    console.error('Lỗi khi gọi API updateStudent:', error);
    throw error;
  }
};
export const deleteStudent = async (studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: 'DELETE',
      headers: headers,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi gọi API deleteStudent:', error);
    throw error;
  }
};
