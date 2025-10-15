<template>
  <div class="page">
    <div class="header">
      <div class="logo"></div>
      <div class="spacer" ></div>
      <div class="welcome">Welcome, {{ userName }}</div>
      <a class="logout" href="#"  @click.prevent="onLogout">Logout</a>
    </div>

    <div class="search-panel">
      <div class="search-form">
        <div class="search-fields">
          <div class="search-field">
            <label>Student Code :</label>
            <InputText
              v-model.trim="filters.code"
              :maxlength="10"
              @keydown.space.prevent
              placeholder="Enter student code"
            />
          </div>
          <div class="search-field">
            <label>Student Name :</label>
            <InputText
              v-model.trim="filters.name"
              :maxlength="20"
              @keydown.space.prevent
              placeholder="Enter student name"
            />
          </div>
          <div class="search-field">
            <label>Birthday :</label>
            <Calendar 
              v-model="filters.birthday" 
              dateFormat="mm/dd/yy" 
              showIcon 
              placeholder="Select date"
            />
          </div>
        </div>
        <div class="search-actions">
          <Button 
            label="Search" 
            class="p-button-info" 
            @click="onSearch" 
          />
          <Button 
            label="Refresh" 
            class="p-button-secondary" 
            @click="loadStudents" 
            icon="pi pi-refresh"
          />
          <Button 
            label="Add Student" 
            class="p-button-success" 
            @click="onAdd" 
          />
        </div>
      </div>
    </div>

    <DataTable
      :value="pagedRows"
      paginator
      :rows="10"
      :totalRecords="rows.length"
      :first="first"
      @page="onPage"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 20]"
      class="p-datatable-sm"
      :loading="loading"
      showGridlines
      stripedRows
    >
      <Column field="no" header="No" sortable style="width: 60px">
        <template #body="slotProps">
          {{ slotProps.data.no }}
        </template>
      </Column>
      <Column field="code" header="Code" sortable style="width: 100px">
        <template #body="slotProps">
          <span class="font-mono">{{ slotProps.data.code }}</span>
        </template>
      </Column>
      <Column field="name" header="Name" sortable style="width: 150px">
        <template #body="slotProps">
          <span class="font-semibold">{{ slotProps.data.name }}</span>
        </template>
      </Column>
      <Column field="birthday" header="Birthday" sortable style="width: 120px">
        <template #body="slotProps">
          <span class="text-gray-600">{{ slotProps.data.birthday }}</span>
        </template>
      </Column>
      <Column field="address" header="Address" style="width: 200px">
        <template #body="slotProps">
          <span class="text-gray-700">{{ slotProps.data.address }}</span>
        </template>
      </Column>
      <Column field="score" header="Score" sortable style="width: 80px">
        <template #body="slotProps">
          <span class="font-semibold text-blue-600">{{ slotProps.data.score }}</span>
        </template>
      </Column>
      <Column header="Edit" style="width: 100px">
        <template #body="slotProps">
          <div class="actions">
            <Button
              label="Edit"
              class="p-button-text p-button-sm"
              @click="onEdit(slotProps.data)"
            />
            <span class="mx-1">-</span>
            <Button
              label="Delete"
              class="p-button-text p-button-sm p-button-danger"
              @click="onDelete(slotProps.data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onActivated } from "vue";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { getStudents, deleteStudent } from "../service/student.js";
import { useAuth} from "@/stores/auth.js";
import '../styles/list.css'

const router = useRouter();
const confirm = useConfirm();
const toast = useToast();
const auth = useAuth();
const userName = computed(() => auth.user || "NguyenVanA");
const loading = ref(false);
const error = ref(null);

const filters = reactive({ code: "", name: "", birthday: null });

const rows = ref([]);
const originalRows = ref([]);
const searchResults = ref([]);
const isSearching = ref(false);

const first = ref(0);

const transformStudentData = (apiData) => {
  return apiData.map((student, index) => ({
    no: index + 1,
    id: student.studentId,
    code: student.studentCode,
    name: student.studentName,
    birthday: formatDate(student.dateOfBirth),
    address: student.address,
    score: student.averageScore
  }));
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const loadStudents = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await getStudents();
    
    if (response.status === 200 && response.data) {
      const transformedData = transformStudentData(response.data);
      rows.value = transformedData;
      originalRows.value = [...transformedData];
      isSearching.value = false;
      toast.add({
        severity: "success",
        summary: "Thành công",
        detail: response.message || "Tải danh sách sinh viên thành công",
        life: 2000
      });
    } else {
      throw new Error(response.message || "Không thể tải dữ liệu");
    }
  } catch (err) {
    error.value = err.message;
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: err.message || "Có lỗi xảy ra khi tải dữ liệu",
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const pagedRows = computed(() => {
  const dataToShow = isSearching.value ? searchResults.value : originalRows.value;
  return dataToShow;
});

onMounted(() => {
  loadStudents();
});
onActivated(() => {
  loadStudents();
});
function onPage(e) {
  first.value = e.first;
}

function onSearch() {
  try {
    first.value = 0;
    let filtered = [...originalRows.value];
    if (filters.code) {
      filtered = filtered.filter(row => 
        row.code.toLowerCase().includes(filters.code.toLowerCase())
      );
    }
    if (filters.name) {
      filtered = filtered.filter(row => 
        row.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.birthday) {
      const selectedDate = new Date(filters.birthday);
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = String(selectedDate.getFullYear());
      const targetDate = `${month}/${day}/${year}`;
      filtered = filtered.filter(row => {
        return row.birthday === targetDate;
      });
    }
    searchResults.value = filtered.map((r, idx) => ({ ...r, no: idx + 1 }));
    isSearching.value = true;
    const resultCount = searchResults.value.length;
    if (resultCount === 0) {
      toast.add({
        severity: "info",
        summary: "Không tìm thấy",
        detail: "Không có kết quả phù hợp với điều kiện tìm kiếm",
        life: 3000
      });
    } else {
      toast.add({
        severity: "success", 
        summary: "Tìm kiếm thành công",
        detail: `Tìm thấy ${resultCount} kết quả`,
        life: 2000
      });
    }
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Lỗi tìm kiếm",
      detail: err.message || "Có lỗi xảy ra khi tìm kiếm",
      life: 3000
    });
  }
}

function onAdd() {
  router.push("/student");
}

function onEdit(row) {
  router.push(
    `/student/${row.id}`);
}

function onDelete(row) {
  confirm.require({
    message: `Xóa sinh viên ${row.code}?`,
    header: "Xác nhận",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        loading.value = true;
        const response = await deleteStudent(row.id);
        
        if (response.status === 200) {
          // Xóa khỏi tất cả danh sách
          rows.value = rows.value.filter((r) => r.id !== row.id);
          originalRows.value = originalRows.value.filter((r) => r.id !== row.id);
          searchResults.value = searchResults.value.filter((r) => r.id !== row.id);
          toast.add({
            severity: "success",
            summary: "Thành công",
            detail: response.message || "Đã xóa sinh viên thành công",
            life: 2000
          });
        } else {
          throw new Error(response.message || "Không thể xóa sinh viên");
        }
      } catch (err) {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          detail: err.message || "Có lỗi xảy ra khi xóa sinh viên",
          life: 3000
        });
      } finally {
        loadStudents();
        loading.value = false;
      }
    },
  });
}
function onLogout() {
  auth.logout();
  router.push("/login");
}
</script>


