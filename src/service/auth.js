const API_BASE_URL = 'http://localhost:8080/api';
export const login = async (userName, password) => {
  try {
    console.log("Calling login API with:", userName, password);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi gọi API login:', error);
    throw error;
  }
}
export const register = async (registerData) =>{
  try {
    console.log("Calling register API with:", registerData);
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi gọi API register:', error);
    throw error;
  }
}
