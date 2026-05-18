<script setup lang="ts">
import { computed, h, reactive, ref, shallowRef } from 'vue';
import { NPopconfirm, NTag } from 'naive-ui';
import { useBoolean, useLoading } from '@sa/hooks';
import { useNaiveForm, useFormRules } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'UserManage' });

interface UserItem {
  id: string;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  status: 'enable' | 'disable';
  role: string;
  createTime: string;
}

interface SearchFormData {
  username: string | null;
  nickname: string | null;
  status: string | null;
  email: string | null;
}

interface UserFormData {
  id?: string;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  status: 'enable' | 'disable';
  role: string;
}

const { loading, startLoading, endLoading } = useLoading();
const { bool: drawerVisible, setTrue: openDrawer, setFalse: closeDrawer } = useBoolean();
const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule, patternRules } = useFormRules();

const operateType = shallowRef<'add' | 'edit'>('add');

const searchForm = reactive<SearchFormData>({
  username: null,
  nickname: null,
  status: null,
  email: null
});

const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 50]
});

const tableData = shallowRef<UserItem[]>([]);
const checkedRowKeys = ref<(string | number)[]>([]);
const editingData = shallowRef<UserItem | null>(null);

const userForm = reactive<UserFormData>({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  status: 'enable',
  role: 'user'
});

const statusOptions = [
  { label: '启用', value: 'enable' },
  { label: '禁用', value: 'disable' }
];

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' }
];

const columns = computed(() => [
  { type: 'selection' as const, align: 'center' as const },
  { key: 'index', title: $t('common.index'), align: 'center' as const, width: 60 },
  { key: 'username', title: '用户名', align: 'center' as const, width: 120 },
  { key: 'nickname', title: '昵称', align: 'center' as const, width: 120 },
  { key: 'email', title: '邮箱', align: 'center' as const, width: 180 },
  { key: 'phone', title: '手机号', align: 'center' as const, width: 140 },
  {
    key: 'status',
    title: '状态',
    align: 'center' as const,
    width: 100,
    render: (row: UserItem) => {
      const statusMap: Record<string, { type: 'success' | 'error'; text: string }> = {
        enable: { type: 'success', text: '启用' },
        disable: { type: 'error', text: '禁用' }
      };
      const status = statusMap[row.status];
      return h(NTag, { type: status.type, size: 'small' }, { default: () => status.text });
    }
  },
  {
    key: 'role',
    title: '角色',
    align: 'center' as const,
    width: 100,
    render: (row: UserItem) => {
      const roleMap: Record<string, string> = {
        admin: '管理员',
        user: '普通用户'
      };
      return roleMap[row.role] || row.role;
    }
  },
  { key: 'createTime', title: '创建时间', align: 'center' as const, width: 180 },
  {
    key: 'operate',
    title: $t('common.operate'),
    align: 'center' as const,
    width: 140,
    render: (row: UserItem) => {
      return h(NSpace, { justify: 'center' }, () => [
        h(
          NButton,
          { size: 'small', type: 'primary', ghost: true, onClick: () => handleEdit(row) },
          { default: () => $t('common.edit') }
        ),
        h(
          NPopconfirm,
          { onPositiveClick: () => handleDelete(row.id) },
          {
            trigger: () =>
              h(NButton, { size: 'small', type: 'error', ghost: true }, { default: () => $t('common.delete') }),
            default: () => $t('common.confirmDelete')
          }
        )
      ]);
    }
  }
]);

const formRules = computed(() => ({
  username: [defaultRequiredRule],
  nickname: [defaultRequiredRule],
  email: [defaultRequiredRule, patternRules.email],
  phone: [defaultRequiredRule, patternRules.phone],
  status: [defaultRequiredRule],
  role: [defaultRequiredRule]
}));

const drawerTitle = computed(() => (operateType.value === 'add' ? '新增用户' : '编辑用户'));

function mockFetchData(): UserItem[] {
  const data: UserItem[] = [];
  for (let i = 1; i <= 50; i++) {
    data.push({
      id: `user-${i}`,
      username: `user${i}`,
      nickname: `用户${i}`,
      email: `user${i}@example.com`,
      phone: `13800138000`,
      status: i % 3 === 0 ? 'disable' : 'enable',
      role: i % 5 === 0 ? 'admin' : 'user',
      createTime: '2024-01-01 10:00:00'
    });
  }
  return data;
}

async function getData() {
  startLoading();
  await new Promise(resolve => setTimeout(resolve, 500));

  let data = mockFetchData();

  if (searchForm.username) {
    data = data.filter(item => item.username.includes(searchForm.username!));
  }
  if (searchForm.nickname) {
    data = data.filter(item => item.nickname.includes(searchForm.nickname!));
  }
  if (searchForm.status) {
    data = data.filter(item => item.status === searchForm.status);
  }
  if (searchForm.email) {
    data = data.filter(item => item.email.includes(searchForm.email!));
  }

  pagination.itemCount = data.length;
  const start = (pagination.page - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  tableData.value = data.slice(start, end);

  endLoading();
}

function handleSearch() {
  pagination.page = 1;
  getData();
}

function handleReset() {
  Object.assign(searchForm, {
    username: null,
    nickname: null,
    status: null,
    email: null
  });
  pagination.page = 1;
  getData();
}

function handleAdd() {
  operateType.value = 'add';
  Object.assign(userForm, {
    id: undefined,
    username: '',
    nickname: '',
    email: '',
    phone: '',
    status: 'enable',
    role: 'user'
  });
  restoreValidation();
  openDrawer();
}

function handleEdit(row: UserItem) {
  operateType.value = 'edit';
  editingData.value = { ...row };
  Object.assign(userForm, { ...row });
  restoreValidation();
  openDrawer();
}

async function handleSubmit() {
  await validate();

  if (operateType.value === 'add') {
    window.$message?.success($t('common.addSuccess'));
  } else {
    window.$message?.success($t('common.updateSuccess'));
  }

  closeDrawer();
  getData();
}

function handleDelete(id: string) {
  const index = tableData.value.findIndex(item => item.id === id);
  if (index > -1) {
    tableData.value.splice(index, 1);
    pagination.itemCount--;
  }
  window.$message?.success($t('common.deleteSuccess'));
}

function handleBatchDelete() {
  if (checkedRowKeys.value.length === 0) {
    window.$message?.warning('请选择要删除的数据');
    return;
  }
  tableData.value = tableData.value.filter(item => !checkedRowKeys.value.includes(item.id));
  pagination.itemCount -= checkedRowKeys.value.length;
  checkedRowKeys.value = [];
  window.$message?.success($t('common.deleteSuccess'));
}

function handleRefresh() {
  getData();
}

function onCheckedRowKeysChange(keys: (string | number)[]) {
  checkedRowKeys.value = keys;
}

function onPaginationUpdate(page: number) {
  pagination.page = page;
  getData();
}

function onPageSizeUpdate(pageSize: number) {
  pagination.pageSize = pageSize;
  pagination.page = 1;
  getData();
}

function init() {
  getData();
}

init();
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :bordered="false" size="small" class="card-wrapper">
      <SearchFormWrap @search="handleSearch" @reset="handleReset">
        <NFormItem label="用户名" path="username">
          <NInput
            v-model:value="searchForm.username"
            placeholder="请输入用户名"
            clearable
            @keydown.enter="handleSearch"
          />
        </NFormItem>
        <NFormItem label="昵称" path="nickname">
          <NInput
            v-model:value="searchForm.nickname"
            placeholder="请输入昵称"
            clearable
            @keydown.enter="handleSearch"
          />
        </NFormItem>
        <NFormItem label="状态" path="status">
          <NSelect v-model:value="searchForm.status" :options="statusOptions" placeholder="请选择状态" clearable />
        </NFormItem>
        <NFormItem label="邮箱" path="email">
          <NInput v-model:value="searchForm.email" placeholder="请输入邮箱" clearable @keydown.enter="handleSearch" />
        </NFormItem>
      </SearchFormWrap>
    </NCard>

    <NCard :bordered="false" size="small" class="card-wrapper">
      <template #header>
        <NSpace justify="end">
          <NButton type="primary" ghost size="small" @click="handleAdd">
            <template #icon>
              <icon-ic-round-plus class="text-icon" />
            </template>
            {{ $t('common.add') }}
          </NButton>
          <NPopconfirm @positive-click="handleBatchDelete">
            <template #trigger>
              <NButton type="error" ghost size="small" :disabled="checkedRowKeys.length === 0">
                <template #icon>
                  <icon-ic-round-delete class="text-icon" />
                </template>
                {{ $t('common.batchDelete') }}
              </NButton>
            </template>
            {{ $t('common.confirmDelete') }}
          </NPopconfirm>
          <NButton size="small" @click="handleRefresh">
            <template #icon>
              <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
            </template>
            {{ $t('common.refresh') }}
          </NButton>
        </NSpace>
      </template>

      <NDataTable
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :row-key="(row: UserItem) => row.id"
        :checked-row-keys="checkedRowKeys"
        :pagination="{
          page: pagination.page,
          pageSize: pagination.pageSize,
          itemCount: pagination.itemCount,
          showSizePicker: pagination.showSizePicker,
          pageSizes: pagination.pageSizes,
          prefix: page => $t('datatable.itemCount', { total: page.itemCount }),
          onUpdatePage: onPaginationUpdate,
          onUpdatePageSize: onPageSizeUpdate
        }"
        :scroll-x="1200"
        remote
        @update:checked-row-keys="onCheckedRowKeysChange"
      />
    </NCard>

    <NDrawer v-model:show="drawerVisible" :width="400" placement="right">
      <NDrawerContent :title="drawerTitle" closable>
        <NForm ref="formRef" :model="userForm" :rules="formRules" label-placement="left" label-width="80">
          <NFormItem label="用户名" path="username">
            <NInput v-model:value="userForm.username" placeholder="请输入用户名" :disabled="operateType === 'edit'" />
          </NFormItem>
          <NFormItem label="昵称" path="nickname">
            <NInput v-model:value="userForm.nickname" placeholder="请输入昵称" />
          </NFormItem>
          <NFormItem label="邮箱" path="email">
            <NInput v-model:value="userForm.email" placeholder="请输入邮箱" />
          </NFormItem>
          <NFormItem label="手机号" path="phone">
            <NInput v-model:value="userForm.phone" placeholder="请输入手机号" />
          </NFormItem>
          <NFormItem label="状态" path="status">
            <NSelect v-model:value="userForm.status" :options="statusOptions" placeholder="请选择状态" />
          </NFormItem>
          <NFormItem label="角色" path="role">
            <NSelect v-model:value="userForm.role" :options="roleOptions" placeholder="请选择角色" />
          </NFormItem>
        </NForm>
        <template #footer>
          <NSpace justify="end">
            <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
            <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
          </NSpace>
        </template>
      </NDrawerContent>
    </NDrawer>
  </NSpace>
</template>

<style scoped></style>
