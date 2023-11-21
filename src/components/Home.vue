<!-- Home.vue -->

<template>
    <a-layout class="layout">
        <a-layout-header style="background: #fff; padding: 10px;">

            <a-space>
                <!-- 搜索框 -->
                <a-input placeholder="请输入搜索内容" v-model="searchValue" />
                <!-- 搜索按钮 -->
                <a-button :icon="h(SearchOutlined)">Search</a-button>

                <!-- 刷新按钮 -->
                <a-button :icon="h(ReloadOutlined)" @click="reloadTable">reload</a-button>

                <a-popconfirm title="Are you sure flush?" ok-text="Yes" cancel-text="No" @confirm="flush"
                    @cancel="reloadTable">

                    <!-- 清除所有任务按钮 -->
                    <a-button :icon="h(ReloadOutlined)" type="primary" danger>flush</a-button>
                </a-popconfirm>



            </a-space>

        </a-layout-header>
        <a-layout-content>

            <a-table :columns="columns" :data-source="tasks">

                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'errors'">
                        <template v-if="record.errors.length > 0">
                            <a @click="goToErrorDetail(record.task_id)">
                                {{ record.errors }}
                            </a>
                        </template>
                        <template v-else>
                            <a-tag color="green">No errors</a-tag>
                        </template>
                    </template>
                    <template v-else-if="column.key === 'logs'">
                        <template v-if="record.logs > 0">
                            <a @click="goToLogDetail(record.task_id)">
                                {{ record.logs }}
                            </a>
                        </template>
                        <template v-else>
                            <a-tag color="green">No logs</a-tag>
                        </template>
                    </template>

                    <template v-else-if="column.key === 'status'">
                        <!-- <span :style="{ backgroundColor: getStatusdColor(record.status) }">{{ record.status }}</span> -->
                        <a-tag :color="getStatusdColor(record.status)">{{ record.status }}</a-tag>
                    </template>

                    <template v-else-if="column.key === 'injected'">
                        <template v-if="record.injected === true">
                            <!-- <a @click="goToPayloadDetails(record.task_id)"><span
                                    :style="{ backgroundColor: getInjectedColor(record.injected) }">{{ record.injected }}</span></a> -->
                            <a-tag :color="getInjectedColor(record.injected)"><a @click="goToPayloadDetails(record.task_id)" >{{ record.injected }}</a></a-tag>
                        </template>
                        <template v-else>
                            <template v-if="record.status === TaskStatus.Terminated">
                                <a-tag color="green">No injected</a-tag>
                            </template>
                            <template v-else>
                                <a-tag color="blue">Unkown</a-tag>
                            </template>
                        </template>

                    </template>


                    <template v-else-if="column.key === 'action'">
                        <a-space>
                            <template v-if="CanStopTaskStatus.includes(record.status)">
                                <!-- <a-button @click="stopTask(record.task_id)" type="primary"
                                    style="background-color: #FFA500;">Stop</a-button> -->
                                    <a-popconfirm title="Are you sure stop?" ok-text="Yes" cancel-text="No" @confirm="stopTask(record.task_id)"
                                    @cancel="reloadTable">
                                    <template #icon><question-circle-outlined style="color: red" /></template>

                                    <!-- 清除所有任务按钮 -->
                                    <a-button :icon="h(StopOutlined)" type="primary" danger>Stop</a-button>
                                </a-popconfirm>
                            </template>
                            <template v-else>
                                <a-button type="primary" block disabled>Stop</a-button>
                            </template>


                            <template v-if="record.status === CanStartTaskStatus">
                                <a-button type="primary" block @click="startTask(record.task_id)">Start</a-button>
                            </template>
                            <template v-else>
                                <a-button type="primary" block disabled>Start</a-button>
                            </template>

                            <template v-if="CanKillTaskStatus.includes(record.status)">
                                <!-- <a-button @click="killTask(record.task_id)" type="primary"
                                    style="background-color: #FF3333;">Kill</a-button> -->
                                    <a-popconfirm title="Are you sure kill?" ok-text="Yes" cancel-text="No" @confirm="killTask(record.task_id)"
                                    @cancel="reloadTable">

                                    <!-- 清除所有任务按钮 -->
                                    <a-button :icon="h(DeleteOutlined)" type="primary" danger>Kill</a-button>
                                </a-popconfirm>
                            </template>
                            <template v-else>
                                <a-button type="primary" danger disabled>Kill</a-button>
                            </template>

                            <!-- <a-button @click="deleteTask(record.task_id)" type="primary"
                                style="background-color: #CC0000;" :icon="h(DeleteOutlined)">Delete</a-button> -->

                                <a-popconfirm title="Are you sure delete?" ok-text="Yes" cancel-text="No" @confirm="deleteTask(record.task_id)">
                                    <template #icon><question-circle-outlined style="color: red" /></template>
                                    <!-- 清除所有任务按钮 -->
                                    <a-button :icon="h(DeleteOutlined)" type="primary" danger>Delete</a-button>
                                </a-popconfirm>
                        </a-space>
                    </template>

                </template>

            </a-table>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
            Sqlmap api web ui to manager scan tasks.
        </a-layout-footer>
    </a-layout>

    <contextHolder />
</template>
  
<script setup>
import { getTaskList, stopTaskApi, killTaskApi, deleteTaskApi, flushApi, startTaskApi } from '../api';
import { useRouter } from 'vue-router';
import { ref, computed, reactive, onBeforeMount, h } from 'vue';
import {
    SearchOutlined,
    ReloadOutlined,
    StopOutlined,
    CloseOutlined,
    DeleteOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';


const router = useRouter();

const [api, contextHolder] = notification.useNotification();

const openNotification = (title, desc) => {
    notification.open({
        message: title,
        description: desc
    });
};

const name = ref('Home');

var TaskStatus = {
    New: 'New',
    Runnable: 'Runnable',
    Running: 'Running',
    Blocked: 'Blocked',
    Terminated: 'Terminated'
};

var TaskStatusColor = {
    New: '#66FF66',
    Runnable: '#FFCC00',
    Running: '#33FF33',
    Blocked: '#FF3333',
    Terminated: '#999999',
    Unknown: '#1890ff'
}

var TaskStatusColorMap = {
    'New': TaskStatusColor.New,
    'Runnable': TaskStatusColor.Runnable,
    'Running': TaskStatusColor.Running,
    'Blocked': TaskStatusColor.Blocked,
    'Terminated': TaskStatusColor.Terminated,
    'Unknown': TaskStatusColor.Unknown
}

var CanStopTaskStatus = [
    TaskStatus.New,
    TaskStatus.Runnable,
    TaskStatus.Running
];

var CanStartTaskStatus = TaskStatus.Blocked;

var CanKillTaskStatus = [
    TaskStatus.New,
    TaskStatus.Runnable,
    TaskStatus.Running,
    TaskStatus.Blocked
];

const searchValue = ref('');
const goToErrorDetail = taskId => {
    router.push({ name: 'ErrorDetail', params: { taskId } });
};

const goToLogDetail = taskId => {
    router.push({ name: 'LogDetail', params: { taskId } });
};

const goToPayloadDetails = taskId => {
    router.push({ name: 'PayloadDetail', params: { taskId } });
};

// const value = ref('example');

function getStatusdColor(value) {
    return TaskStatusColorMap[value];
}

function getStatusdColor2(value) {
    if (value === TaskStatus.New) {
        return '#66FF66';
    }
    else {
        return '#FFFFFF';
    }
}

async function reloadTable() {
    // 刷新表格数据的逻辑，根据需求实现
    const data = await getTaskList();
    // console.log(data);
    if (data.success) {
        tasks.value = data.tasks;
    }
}

async function stopTask(taskId) {
    console.log('stopTask: ' + taskId);
    const data = await stopTaskApi(taskId);
    if (data.success) {
        reloadTable();
        // alert ('停止成功');
        openNotification('停止成功', '任务已停止')

    }
}

async function startTask(taskId) {
    // startTask
    console.log('startTask: ' + taskId);
    const data = await startTaskApi(taskId);
    if (data.success) {
        reloadTable();
        // alert ('启动成功');
        openNotification('启动成功', '任务已启动')

    }
}


async function killTask(taskId) {
    console.log('killTask: ' + taskId);
    const data = await killTaskApi(taskId);
    if (data.success) {
        reloadTable();
        // alert ('杀任务成功');
        openNotification('杀任务成功', '任务已停止')
    }
}
async function deleteTask(taskId) {
    console.log('delete: ' + taskId);
    const data = await deleteTaskApi(taskId);
    if (data.success) {
        reloadTable();
        // alert ('删除任务成功');
        openNotification('删除任务成功', '任务已删除')
    }
}

async function flush() {
    console.log('flush');
    const data = await flushApi();
    if (data.success) {
        // alert ('flush成功');
        reloadTable();
        openNotification('flush成功', '已删除所有任务')
    }
}


function getInjectedColor(value) {
    if (value) {
        return 'red';
    } else {
        return 'green';
    }
}

const columns = ref([
    {
        title: '#',
        dataIndex: 'index',
        key: 'index'
    },
    {
        title: 'task id',
        dataIndex: 'task_id',
        key: 'task_id'
    },
    {
        title: 'errors',
        dataIndex: 'errors',
        key: 'errors'
    },
    {
        title: 'logs',
        dataIndex: 'logs',
        key: 'logs'
    },
    {
        title: 'status',
        dataIndex: 'status',
        key: 'status'
    },
    {
        title: 'injected',
        dataIndex: 'injected',
        key: 'injected'
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action'
    },
])

const tasks = ref([]);

onBeforeMount(async () => {

    reloadTable();

})

</script>

<style scoped>
.layout {
    width: 100vw;
    /* 设置宽度为视口宽度 */
    height: 100vh;
    /* 设置高度为视口高度 */
}
</style>