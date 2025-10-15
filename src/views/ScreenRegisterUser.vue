<template>
  <div class="auth-wrapper">
    <div class="register-card">
      <h2 class="title">REGISTER</h2>

      <div class="field">
        <InputText
          v-model="form.userName"
          type="email"
          placeholder="Email"
          autocomplete="username"
          class="w-full"
        />
      </div>

      <div class="field">
        <div class="input-wrapper">
          <InputText
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            autocomplete="new-password"
            class="w-full"
          />
          <button 
            type="button" 
            class="password-toggle"
            @click="showPassword = !showPassword"
            :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
          >
            <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>
      </div>

      <div class="field">
        <div class="input-wrapper">
          <InputText
            v-model="form.password2"
            :type="showPassword2 ? 'text' : 'password'"
            placeholder="Confirm Password"
            autocomplete="new-password"
            class="w-full"
          />
          <button 
            type="button" 
            class="password-toggle"
            @click="showPassword2 = !showPassword2"
            :aria-label="showPassword2 ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
          >
            <i :class="showPassword2 ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>
      </div>

      <div class="actions-right">
        <Button
          label="Back"
          class="back-button"
          @click="onBack"
        />
        <Button
          label="REGISTER"
          class="register-button"
          @click="onRegister"
        />
      </div>
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
  </div>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import {register} from "@/service/auth"

const router = useRouter();
const message = ref("");
const showMessage = ref(false);
const showPassword = ref(false);
const showPassword2 = ref(false);

const form = reactive({ userName: "", password: "", password2: "" });
const isOneByte = (s) => /^[\x00-\x7F]*$/.test(s);

function onBack() {
  router.push("/login");
}

function onValidate() {
  if (!form.userName||!form.password||!form.password2) {
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
    if (form.password2.length < 6) {
    message.value = "Mật khẩu xác nhận phải có ít nhất 6 ký tự";
    showMessage.value = true;
    return false;
  }
  if (form.password2.length > 15) {
    message.value = "Mật khẩu xác nhận không được quá 15 ký tự";
    showMessage.value = true;
    return false;
  }
  
  if (!isOneByte(form.password2)) {
    message.value = "Mật khẩu xác nhận không được chứa ký tự tiếng Việt có dấu, emoji hoặc ký tự đặc biệt Unicode";
    showMessage.value = true;
    return false;
  }
  if (form.password !== form.password2) {
    message.value = "Mật khẩu không khớp";
    showMessage.value = true;
    return false;
  }
  return true;
}
const onRegister=async()=>{
  if(!onValidate()){
    return
  }
  try {
    const registerData = {
      userName: form.userName,
      password: form.password,
      confirmPassword: form.password2
    };
    const response = await register(registerData);
    console.log("Register response:", response);
    if (response.status === 200) {
      message.value = "Đăng ký thành công!";
      showMessage.value = true;
      setTimeout(() => {
        showMessage.value = false;
        router.push("/login");
      }, 1500);
    } else {
      message.value = response.message || "Đăng ký thất bại. Vui lòng thử lại.";
      showMessage.value = true;
    }
  } catch (error) {
    console.error("Register error:", error);
    message.value = "Đăng ký thất bại. Vui lòng thử lại.";
    showMessage.value = true;
  }
}
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 16px;
  background: #f8f9fa;
}
.w-full {
  width: 100%;
  padding: 12px 48px 12px 12px !important;
}
.register-card {
  width: 420px;
  padding: 32px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.title {
  text-align: left;
  margin: 0 0 32px 0;
  font-weight: 600;
  font-size: 24px;
  color: #2f3b52;
}
.field {
  margin-bottom: 20px;
}
.input-wrapper {
  position: relative;
  width: 100%;
}
.input-icon-left {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 16px;
  z-index: 2;
}
.input-with-icons {
  width: 100%;
  height: 48px;
  padding: 12px 48px 12px 48px !important;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}
.input-with-icons:focus {
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
.actions-right {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
.back-button {
  padding: 12px 24px;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  background: #ffffff;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
}
.back-button:hover {
  background: #f9fafb;
}
.register-button {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  background: #555;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}
.register-button:hover:not(:disabled) {
  background: #444;
}
.register-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
 </style>
