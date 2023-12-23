<!-- LogDetail.vue -->

<template>
  <a-layout class="layout">
    <a-layout-header>
      <a-space>
        <a-button :icon="h(RollbackOutlined)" @click="goHomePage">goHome</a-button>
      </a-space>

    </a-layout-header>
    <a-layout-content>
      <a-table :columns="columns" :data-source="logs">

        <template #bodyCell="{ column, record }">

          <template v-if="column.key === 'datetime'">
            <template v-if="record.level === 'INFO'">
              <span style="color: #00a67c;">{{ record.datetime }}</span>
            </template>
            <template v-else-if="record.level === 'WARNING'">
              <span style="color: #f0ad4e;">{{ record.datetime }}</span>
            </template>
            <template v-else-if="record.level === 'ERROR'">
              <span style="color: #dd514c;">{{ record.datetime }}</span>
            </template>
            <template v-else-if="record.level === 'CRITICAL'">
              <span style="color: red;">{{ record.datetime }}</span>
            </template>
          </template>

          <template v-if="column.key === 'level'">
            <template v-if="record.level === 'INFO'">
              <span style="color: #00a67c;">{{ record.level }}</span>
            </template>
            <template v-else-if="record.level === 'WARNING'">
              <span style="color: #f0ad4e;">{{ record.level }}</span>
            </template>
            <template v-else-if="record.level === 'ERROR'">
              <span style="color: #dd514c;">{{ record.level }}</span>
            </template>
            <template v-else-if="record.level === 'CRITICAL'">
              <span style="color: red;">{{ record.level }}</span>
            </template>
          </template>
          <template v-if="column.key === 'message'">
            <template v-if="record.level === 'INFO'">
              <span style="color: #00a67c;">{{ record.message }}</span>
            </template>
            <template v-else-if="record.level === 'WARNING'">
              <span style="color: #f0ad4e;">{{ record.message }}</span>
            </template>
            <template v-else-if="record.level === 'ERROR'">
              <span style="color: #dd514c;">{{ record.message }}</span>
            </template>
            <template v-else-if="record.level === 'CRITICAL'">
              <span style="color: red">{{ record.message }}</span>
            </template>
          </template>
        </template>

      </a-table>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>
  
<script setup>
import { ref, onMounted, h } from 'vue';
import { useRouter  } from 'vue-router';
import { getLogDetails } from '../api';

import {
  RollbackOutlined
} from '@ant-design/icons-vue';

const router = useRouter();

const name = ref('ErrorDetail');
const taskId = ref('');
const logs = ref([]);
const columns = ref([
  {
    title: '#',
    dataIndex: 'index',
    key: 'index'
  },
  {
    title: 'datetime',
    dataIndex: 'datetime',
    key: 'datetime'
  },
  {
    title: 'level',
    dataIndex: 'level',
    key: 'level'
  },
  {
    title: 'message',
    dataIndex: 'message',
    key: 'message'
  }
])
onMounted(async () => {
  {
    taskId.value = router.currentRoute.value.params.taskId;
    const data = await getLogDetails(taskId.value)
    if (data.success) {
      logs.value = data.logs;
    }
  }
})

function goHomePage(){
  router.replace({ path: '/' })
}

</script>

<style scoped>
.layout {
  width: 100vw;
  /* 设置宽度为视口宽度 */
  height: 100vh;
  /* 设置高度为视口高度 */
}
</style>