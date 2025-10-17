<template>
  <div class="page">
    <div class="header">
      <div class="logo">
        <i class="pi pi-building logo-icon"></i>
        <div class="school-info">
          <div class="school-name">Trường Đại Học Bách Khoa</div>
          <div class="school-subtitle">Hanoi University of Science and Technology</div>
        </div>
      </div>
      <div class="spacer" />
      <div v-show="isEdit" class="welcome">Welcome, {{ userName }}</div>
      <a class="logout" href="#" @click.prevent="logout">Logout</a>
    </div>

    <div class="content-section form p-fluid">
      <h2>STUDENT</h2>
      <div class="row" v-if="isEdit">
        <label>Student Id :</label>
        <InputText v-model="model.id" :disabled="isEdit" class="half-input" />
      </div>
      <div class="row">
        <label>Student Code :</label>
        <InputText v-model.trim="model.code" :maxlength="10" disabled @keydown.space.prevent />
        <div class="generate-code">
        <Button label="Generate Code" :disabled="isEdit" @click="generateCode" class="p-button-success " />
        </div>
      </div>
      <div class="row">
        <label>Student Name :</label>
        <InputText v-model.trim="model.name" :maxlength="20"  />
      </div>
      <div class="row">
        <label>Birthday :</label>
        <Calendar v-model="model.birthday" dateFormat="mm/dd/yy" :maxDate="today" showIcon :manualInput="false" :readonlyInput="true" />
      </div>
      <div class="row ">
        <label>Address :</label>
        <InputText v-model.trim="model.address" :maxlength="255" class="address-input" />
      </div>
      <div class="row">
        <label>Average Score :</label>
        <InputNumber v-model="model.score" mode="decimal" :minFractionDigits="1" :maxFractionDigits="1" :min="0"  :step="0.1" class="half-input" @keydown.prevent.space />
      </div>
      <div class="actions">
        <Button label="Back" class="p-button-info" @click="goList" />
        <Button label="Save" class="p-button-success"  @click="onSave" />
      </div>
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
</template>

<script setup>
import { reactive, computed, onMounted,ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Dialog from "primevue/dialog";
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import InputNumber from 'primevue/inputnumber'
import { getStudentById, createStudent,updateStudent } from '@/service/student'
import { useAuth} from "@/stores/auth.js";
import "../styles/list.css";
const auth = useAuth();
const userName = computed(() => auth.user || "NguyenVanA");
const router = useRouter()
const route = useRoute()
const toast = useToast()
const isEdit = computed(() => !!route.params.id)
const message = ref("");
const showMessage = ref(false);
const model = reactive({ id: '', code: '', name: '', birthday: null, address: '', score: null })
const today = new Date()
today.setHours(0,0,0,0)
onMounted(() => {
 if(route.params.id){
  getStudentById1()
 }
   
})
const getStudentById1 = async () => {
  const response = await getStudentById(route.params.id)
  model.id = response.data.studentId
  model.code = response.data.studentCode
  model.name = response.data.studentName
  model.birthday = response.data.dateOfBirth
  model.address = response.data.address
  model.score = response.data.averageScore
}
const createStudent1 = async () => {
 
  const student = {
    studentCode: model.code,
    studentName: model.name,
    dateOfBirth: model.birthday,
    address: model.address,
    averageScore: model.score
  }
  const response = await createStudent(student)
  if(response&&response.status==400){
    message.value = response.message;
    showMessage.value = true;
  }
  else{
    toast.add({ severity:'success', summary:'Saved', detail: isEdit.value ? 'Đã cập nhật' : 'Đã tạo mới', life: 1200 })
    goList()
  }
}
const updateStudent1 = async () => {
 
  const student = {
    studentCode: model.code,
    studentName: model.name,
    dateOfBirth: model.birthday,
    address: model.address,
    averageScore: model.score
  }
  const response = await updateStudent(model.id,student)
  if(response&&response.status==400){
    message.value = response.message;
    showMessage.value = true;
  }
  else{
    toast.add({ severity:'success', summary:'Saved', detail: isEdit.value ? 'Đã cập nhật' : 'Đã tạo mới', life: 1200 })
    goList()
  }
}
function generateCode(){
  const rand = Math.floor(100 + Math.random()*900)
  model.code = `STU${rand}`
}

function onValidate(){
  if (!model.code || !model.name||!model.birthday||model.score===null||model.score===undefined||model.address.trim()===''||model.address===null) {
    message.value = 'Vui lòng nhập đầy đủ thông tin';
    showMessage.value = true;
    return false;
  }

  if (model.name.length > 20) {
    message.value = 'Student Name không được quá 20 ký tự';
    showMessage.value = true;
    return false;
  }


  if (!model.birthday) {
    message.value = 'Vui lòng chọn Birthday';
    showMessage.value = true;
    return false;
  }

  if (model.address && model.address.length > 255) {
    message.value = 'Address không được quá 255 ký tự';
    showMessage.value = true;
    return false;
  }

  if (model.score === null || model.score === undefined || isNaN(Number(model.score))) {
    message.value = 'Vui lòng nhập Average Score hợp lệ';
    showMessage.value = true;
    return false;
  }
  const numericScore = Number(model.score);
  if (numericScore < 0 || numericScore > 10) {
    message.value = 'Average Score phải nằm trong khoảng 0 - 10';
    showMessage.value = true;
    return false;
  }

  model.name = model.name.replace(/\s+/g, ' ').trim();

  return true;
  
}

function onSave(){
 if(onValidate()===false){
  return
 }

  if(route.params.id)
{
  updateStudent1()
}else
{
  createStudent1()
}

}

function goList(){
   router.push('/list') }
  function logout() {
    auth.logout();
    router.push("/login");
  }
</script>

<style scoped>
.page{ padding:16px; }
.header{ display:flex; align-items:center; gap:12px; margin-bottom:16px; }
.spacer{ flex:1; }
.welcome{ font-weight:600; }
.logout{ color:#3b82f6;text-decoration: underline; }
.form{ max-width:720px; margin:0 auto; }
.row{ display:flex; align-items:center; gap:8px; margin-bottom:10px; }
.row label{ width:160px; }
.address{
width: 100% !important;
}
/* Làm Address kéo dài hết mức nhưng vẫn thẳng hàng với label */
.row .address-input{ flex:1; min-width:0; }
.actions{ display:flex; justify-content:flex-end; gap:12px; margin-top:12px; }
.generate-code{
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
/* Cố định chiều rộng 10% cho các input "nhỏ" trong layout flex */
.half-input{
  flex: 0 0 10% !important;   /* không giãn, không co, bề ngang 10% */
  max-width: 10% !important;
}
/* Với InputNumber, đảm bảo ô input bên trong lấp đầy wrapper */
.half-input :deep(.p-inputnumber-input){
  width: 100% !important;
}
</style>

