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
      <div class="spacer"></div>
      <div class="welcome">Welcome, {{ userName }}</div>
      <a class="logout" href="#" @click.prevent="onLogout">Logout</a>
    </div>

    <!-- <div class="page-title-header">
      <h2 class="page-title">Student List</h2>
    </div> -->

    <div class="content-section">
      <div class="toolbar">
        <div class="student-card">
          <div class="card-header">
            <h3 class="card-title">Total Students</h3>
          </div>
          <div class="card-content">
            <div class="progress-section">
              <div class="progress-circle">
                <div class="progress-text">{{ originalRows.length }}</div>
              </div>
            </div>
            <div class="illustration-section">
              <i class="pi pi-users illustration-icon"></i>
            </div>
          </div>
        </div>
        <div class="toolbar-filters">
          <div class="row row-name">
            <InputText v-model.trim="filters.name" :maxlength="50" @keydown.space.prevent placeholder="Student name" />
          </div>
          <div class="row row-inline">
            <InputText v-model.trim="filters.code" :maxlength="10" @keydown.space.prevent placeholder="Student code" />
            <Calendar v-model="filters.birthday" dateFormat="mm/dd/yy" showIcon placeholder="Select date" />
          </div>
        </div>
        <div class="toolbar-actions">
          <Button label="Search" icon="pi pi-search" class="p-button-info" @click="onSearch" />
          <Button label="Add Student" icon="pi pi-plus" class="p-button-success" @click="onAdd" />
        </div>
      </div>

      <div class="table-wrapper">
      <DataTable
        :value="pagedRows"
        paginator
        :rows="10"
        stripedRows
        :totalRecords="isSearching ? searchResults.length : originalRows.length"
        :first="first"
        @page="onPage"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 20]"
        class="p-datatable-sm"
        :loading="loading"
      >
        <Column field="no" header="No" sortable style="width: 5%">
          <template #body="slotProps">
            {{ first + slotProps.index + 1 }}
          </template>
        </Column>
        <Column field="code" header="Code" sortable style="width: 15%"></Column>
        <Column field="name" header="Name" sortable style="width: 20%"></Column>
        <Column field="birthday" header="Birthday" sortable style="width: 15%"></Column>
        <Column field="address" header="Address" style="width: 25%"></Column>
        <Column field="score" header="Score" sortable style="width: 10%"></Column>
        <Column header="Actions" style="width: 10%; text-align: center">
          <template #body="slotProps">
            <div class="actions">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-text p-button-info icon-button"
                v-tooltip.top="'Edit Student'"
                @click="onEdit(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-text p-button-danger icon-button"
                v-tooltip.top="'Delete Student'"
                @click="onDelete(slotProps.data)"
              />
            </div>
          </template>
        </Column>
         <template #empty>
              No students found.
         </template>
      </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tooltip from 'primevue/tooltip';
import { getStudents, deleteStudent } from "../service/student.js";
import { useAuth } from "@/stores/auth.js";
import "../styles/list.css";
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();
const auth = useAuth();
const userName = computed(() => auth.user || "NguyenVanA");
const loading = ref(false);
const error = ref(null);

const filters = reactive({ code: "", name: "", birthday: null });

const originalRows = ref([]);
const searchResults = ref([]);
const isSearching = ref(false);

const first = ref(0);
const rowsPerPage = ref(10);

const transformStudentData = (apiData) => {
  return apiData.map((student) => ({
    id: student.studentId,
    code: student.studentCode,
    name: student.studentName,
    birthday: formatDate(student.dateOfBirth),
    address: student.address,
    score: student.averageScore,
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
      originalRows.value = transformedData;
      onClearFilters(); // Reset view
    } else {
      throw new Error(response.message || "Could not load student data");
    }
  } catch (err) {
    error.value = err.message;
    toast.add({
      severity: "error",
      summary: "Error",
      detail: err.message || "An error occurred while loading data",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const pagedRows = computed(() => {
  const dataToShow = isSearching.value ? searchResults.value : originalRows.value;
  return dataToShow.slice(first.value, first.value + rowsPerPage.value);
});

onMounted(loadStudents);

function onPage(event) {
  first.value = event.first;
  rowsPerPage.value = event.rows;
}

function onClearFilters() {
    filters.code = "";
    filters.name = "";
    filters.birthday = null;
    searchResults.value = [];
    isSearching.value = false;
    first.value = 0; // Reset paginator to the first page
    toast.add({
        severity: 'info',
        summary: 'Cleared',
        detail: 'Search filters have been cleared',
        life: 2000
    });
}

function onSearch() {
  first.value = 0;
  let filtered = [...originalRows.value];
  if (filters.code) {
    filtered = filtered.filter(row => row.code.toLowerCase().includes(filters.code.toLowerCase()));
  }
  if (filters.name) {
    filtered = filtered.filter(row => row.name.toLowerCase().includes(filters.name.toLowerCase()));
  }
  if (filters.birthday) {
    const targetDate = formatDate(filters.birthday);
    filtered = filtered.filter(row => row.birthday === targetDate);
  }
  searchResults.value = filtered;
  isSearching.value = true;
  const resultCount = searchResults.value.length;
  if (resultCount === 0) {
    toast.add({
      severity: "warn",
      summary: "No Results",
      detail: "No students match your search criteria",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "success",
      summary: "Search Complete",
      detail: `Found ${resultCount} matching student(s)`,
      life: 2000,
    });
  }
}

function onAdd() {
  router.push("/student");
}

function onEdit(row) {
  router.push(`/student/${row.id}`);
}

function onDelete(row) {
  confirm.require({
    message: `Are you sure you want to delete student ${row.code} - ${row.name}?`,
    header: "Delete Confirmation",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        loading.value = true;
        const response = await deleteStudent(row.id);
        if (response.status === 200) {
          await loadStudents(); // Reload all data to ensure consistency
          toast.add({
            severity: "success",
            summary: "Success",
            detail: response.message || "Student deleted successfully",
            life: 2000,
          });
        } else {
          throw new Error(response.message || "Could not delete student");
        }
      } catch (err) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: err.message || "An error occurred while deleting the student",
          life: 3000,
        });
      } finally {
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