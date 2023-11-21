<!-- PayloadDetail.vue -->

<template>
  <a-layout class="layout">
    <a-layout-header>
      <a-space>
        <a-button :icon="h(RollbackOutlined)" @click="goHomePage">goHome</a-button>
      </a-space>
    </a-layout-header>
    <a-layout-content>
      <a-table :columns="columns" :data-source="payloads">

        <template #bodyCell="{ column, record }">

        <!-- <template v-if="column.key === 'time'">
            <template v-if="record.level === 'INFO'">
              <span style="color: #00a67c;">{{ record.time }}</span>
            </template>
            <template v-else-if="record.level === 'WARNING'">
              <span style="color: #f0ad4e;">{{ record.time }}</span>
            </template>
            <template v-else-if="record.level === 'ERROR'">
              <span style="color: #dd514c;">{{ record.time }}</span>
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
            </template> -->

          <template v-if="column.key === 'payload_value'">
            <JsonViewer :value="record.payload_value" copyable boxed sort theme="light" />
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
import { JsonViewer } from "vue3-json-viewer"
// if you used v1.0.5 or latster ,you should add import "vue3-json-viewer/dist/index.css"
import "vue3-json-viewer/dist/index.css";
import {
  RollbackOutlined
} from '@ant-design/icons-vue';

import { getPayloadDetails } from '../api';

const name = ref('PayloadDetail');
const taskId = ref('');

const router = useRouter();

const columns = ref([
  {
    title: '#',
    dataIndex: 'index',
    key: 'index'
  },
  {
    title: 'status',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'payload_type',
    dataIndex: 'payload_type',
    key: 'payload_type'
  },
  {
    title: 'payload_value',
    dataIndex: 'payload_value',
    key: 'payload_value'
  }
])

const payloads = ref([])

onMounted(async () => {
  {
    taskId.value = router.currentRoute.value.params.taskId;
    const data = await getPayloadDetails(taskId.value)
    // console.log('PayloadDetail', data)
    if (data.success) {
      payloads.value = data.payloads
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