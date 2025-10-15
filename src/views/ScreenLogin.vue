<template>
  <div class="auth-wrapper">
    <div class="login-card">
      <div class="field">
        <div class="input-wrapper">
          <i class="pi pi-user input-icon"></i>
          <InputText
            v-model="form.userName"
            type="email"
            placeholder="E-mail address"
            autocomplete="username"
            @keydown.enter="onLogin"
            class="input-with-icon"
          />
        </div>
      </div>
      <div class="field">
        <div class="input-wrapper">
          <i class="pi pi-lock input-icon"></i>
          <InputText
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            autocomplete="current-password"
            @keydown.enter="onLogin"
            class="input-with-icon"
          />
          <button 
            type="button" 
            class="password-toggle"
            @click="togglePassword"
            :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
          >
            <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>
      </div>
      <Button
        label="Login"
        @click="onLogin"
        class="login-button"
      />
      <Dialog
        v-model:visible="showMessage"
        modal
        header="Message"
        :style="{ width: '420px' }"
        :closable="true"
      >
        <p>{{ message }}</p>
        <template #footer>
          <Button
            label="Ok"
            icon="pi pi-check"
            @click="showMessage = false"
            class="p-button-text"
          />
        </template>
      </Dialog>
      
    </div>
    <div class="register-box">
        <span style="font-weight: 600;">Don't have an account? </span>
        <RouterLink to="/register" class="link">Register</RouterLink>
      </div>
  </div>
  
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { login } from "../service/auth";
import {useAuth} from "../stores/auth"
const router = useRouter();
const message = ref("");
const showMessage = ref(false);
const showPassword = ref(false);
const auth = useAuth();
const form = reactive({ userName: "", password: "" });
const isOneByte = (s) => {
  return s && s.length > 0 && /^[\x00-\x7F]+$/.test(s);
}

function Validate() {
  if (!form.userName||!form.password) {
    message.value = "Vui lòng nhập đẩy đủ thông tin";
    showMessage.value = true;
    return false;
  }
  
  if (form.userName.length > 20) {
    message.value = "Email không được quá 20 ký tự";
    showMessage.value = true;
    return false;
  }
  
  if (!isOneByte(form.userName)) {
    message.value = "Email không được chứa ký tự tiếng Việt có dấu, emoji hoặc ký tự đặc biệt Unicode";
    showMessage.value = true;
    return false;
  }
  
  
  if (form.password.length < 6) {
    message.value = "Mật khẩu phải có ít nhất 6 ký tự";
    showMessage.value = true;
    return false;
  }
  
  if (form.password.length > 15) {
    message.value = "Mật khẩu không được quá 15 ký tự";
    showMessage.value = true;
    return false;
  }
  
  if (!isOneByte(form.password)) {
    message.value = "Mật khẩu không được chứa ký tự tiếng Việt có dấu, emoji hoặc ký tự đặc biệt Unicode";
    showMessage.value = true;
    return false;
  }
  return true;
  
}
async function onLogin() {
  if (!Validate()) {
    return;
  }
  
  try {
    console.log("Attempting login with:", form.userName, form.password);
    const response = await login(form.userName, form.password);
    console.log("Login response:", response);
    if (response.status==200) {
    auth.loginSaved(
    response.data
  );
      router.push("/list");
    } else {
      message.value = response.message || "Login failed. Please try again.";
      showMessage.value = true;
    }
  } catch (error) {
    message.value = "An error occurred during login. Please try again.";
    showMessage.value = true;
  }
}

function togglePassword() {
  showPassword.value = !showPassword.value;
}
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 16px;
  background: #f8f9fa;
}
.login-card {
  width: 420px;
  padding: 14px;
  border-radius: 8px;
  background: #EEF0F2;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #BCBEBF;
}

.field {
  margin-bottom: 20px;
}
.input-wrapper {
  position: relative;
  width: 100%;
}
InputText{
  background: #ECEEF0;
}
.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 16px;
  z-index: 2;
}
.input-with-icon {
  width: 100%;
  padding-left: 48px !important;
  padding-right: 16px !important;
  height: 48px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}
.input-with-icon:focus {
  border-color: #22b8a7;
  box-shadow: 0 0 0 3px rgba(34, 184, 167, 0.1);
}
.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  z-index: 2;
}
.password-toggle:hover {
  color: #22b8a7;
}
.login-button {
  width: 100%;
  height: 48px;
  background: #22b8a7;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
}
.login-button:hover {
  background: #1ea896;
}
.error-msg{ margin-top:8px; color:#e11d48; font-weight:600; text-align:center; }
.register-box {
  margin-top: 24px;
  border: 1px solid #BCBEBF;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  background: #EEF0F2;
  width: 420px;

}
.register-box .link {
  color: #5B9BD5;
  font-weight: 600;
  text-decoration: none;
}
.register-box .link:hover {
  text-decoration: underline;
}

</style>
