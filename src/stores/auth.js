import { ref, computed } from 'vue'

const isAuthenticated = ref(false)
const user = ref(null)

export const useAuth = () => {
  const loginSaved = (userData) => {
    isAuthenticated.value = true
    user.value = userData
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
  }

  const checkAuth = () => {
    const storedAuth = localStorage.getItem('isAuthenticated')
    const storedUser = localStorage.getItem('user')
    
    if (storedAuth === 'true' && storedUser) {
      isAuthenticated.value = true
      user.value = JSON.parse(storedUser)
    }
  }

  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    user: computed(() => user.value.userName),
    loginSaved,
    logout,
    checkAuth
  }
}
