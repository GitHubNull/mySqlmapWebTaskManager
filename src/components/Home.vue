<!-- Home.vue -->

<template>
    <a-layout class="layout">
        <a-layout-header style="background: #fff; padding: 10px;">

            <a-space>
                <!-- 搜索框 -->
                <a-tooltip placement="topLeft" title="Not yet developed" arrow-point-at-center color="gray"
                    :mouseEnterDelay="1.5">
                    <a-input placeholder="请输入搜索内容" v-model="searchValue" disabled />
                </a-tooltip>
                <!-- 搜索按钮 -->
                <a-tooltip placement="topLeft" title="Not yet developed" arrow-point-at-center color="gray"
                    :mouseEnterDelay="1.5">
                    <a-button :icon="h(SearchOutlined)" disabled>Search</a-button>
                </a-tooltip>

                <!-- 刷新按钮 -->
                <a-tooltip placement="topLeft" title="Click to reload task list." arrow-point-at-center color="blue"
                    :mouseEnterDelay="1.5">
                    <a-button :icon="h(ReloadOutlined)" @click="reloadTable">reload</a-button>
                </a-tooltip>

                <a-popconfirm title="Are you sure flush?" ok-text="Yes" cancel-text="No" @confirm="flush"
                    @cancel="reloadTable">

                    <!-- 清除所有任务按钮 -->
                    <a-tooltip placement="topLeft" title="Click to reload flush all task!" arrow-point-at-center color="red"
                        :mouseEnterDelay="1.5">
                        <a-button :icon="h(ReloadOutlined)" type="primary" danger>flush</a-button>
                    </a-tooltip>
                </a-popconfirm>



            </a-space>

        </a-layout-header>
        <a-layout-content>

            <a-table :columns="columns" :data-source="tasks">

                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'errors'">
                        <template v-if="record.errors.length > 0">
                            <a-tooltip placement="topLeft" title="Click to view errors." arrow-point-at-center color="blue"
                                :mouseEnterDelay="1.5">
                                <a @click="goToErrorDetail(record.task_id)">
                                    {{ record.errors }}
                                </a>
                            </a-tooltip>
                        </template>
                        <template v-else>
                            <a-tag color="success">No errors</a-tag>
                        </template>
                    </template>
                    <template v-else-if="column.dataIndex === 'logs'">
                        <template v-if="record.logs > 0">
                            <a-tooltip placement="topLeft" title="Click to view logs." arrow-point-at-center color="blue"
                                :mouseEnterDelay="1.5">
                                <a-tag>
                                    <a @click="goToLogDetail(record.task_id)">
                                        {{ record.logs }}
                                    </a>
                                </a-tag>
                            </a-tooltip>
                        </template>
                        <template v-else>
                            <a-tag color="default">No logs</a-tag>
                        </template>
                    </template>

                    <template v-else-if="column.dataIndex === 'status'">
                        <!-- <span :style="{ backgroundColor: getStatusdColor(record.status) }">{{ record.status }}</span> -->
                        <a-tag :color="getStatusdColor(record.status)">{{ record.status }}</a-tag>
                    </template>


                    <template v-else-if="column.dataIndex === 'injected'">
                        <template v-if="record.injected === true">
                            <a-tooltip placement="topLeft" title="Click to view payload details." arrow-point-at-center
                                color="blue" :mouseEnterDelay="1.5">
                                <a-tag :color="getInjectedColor(record.injected)"><a
                                        @click="goToPayloadDetails(record.task_id)">{{ record.injected }}</a></a-tag>
                            </a-tooltip>
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


                    <template v-else-if="column.dataIndex === 'action'">
                        <a-space>
                            <template v-if="record.status === CanStartTaskStatus">
                                <a-tooltip placement="topLeft" title="Click to kill this task!" arrow-point-at-center
                                    color="blue" :mouseEnterDelay="1.5">
                                    <a-button :icon="h(PlayCircleOutlined)" type="primary" block
                                        @click="startTask(record.task_id)">Start</a-button>
                                </a-tooltip>
                            </template>
                            <template v-else>
                                <a-tooltip placement="topLeft" title="Click to kill this task!" arrow-point-at-center
                                    color="blue" :mouseEnterDelay="1.5">
                                    <a-button :icon="h(PlayCircleOutlined)" type="primary" block disabled>Start</a-button>
                                </a-tooltip>
                            </template>


                            <template v-if="CanStopTaskStatus.includes(record.status)">
                                <a-popconfirm title="Are you sure stop?" ok-text="Yes" cancel-text="No"
                                    @confirm="stopTask(record.task_id)" @cancel="reloadTable">
                                    <template #icon><question-circle-outlined style="color: red" /></template>
                                    <a-tooltip placement="topLeft" title="Click to kill this task!" arrow-point-at-center
                                        color="volcano" :mouseEnterDelay="1.5">
                                        <a-button :icon="h(PauseCircleOutlined)" type="primary" danger>Stop</a-button>
                                    </a-tooltip>
                                </a-popconfirm>
                            </template>
                            <template v-else>
                                <a-tooltip placement="topLeft" title="Click to kill this task!" arrow-point-at-center
                                    color="volcano" :mouseEnterDelay="1.5">
                                    <a-button :icon="h(PauseCircleOutlined)" type="primary" block disabled>Stop</a-button>
                                </a-tooltip>
                            </template>


                            <template v-if="CanKillTaskStatus.includes(record.status)">
                                <a-popconfirm title="Are you sure kill?" ok-text="Yes" cancel-text="No"
                                    @confirm="killTask(record.task_id)">
                                    <a-tooltip placement="topLeft" title="Click to kill this task!" arrow-point-at-center
                                        color="pink" :mouseEnterDelay="1.5">
                                        <a-button :icon="h(DeleteOutlined)" type="primary" danger>Kill</a-button>
                                    </a-tooltip>
                                </a-popconfirm>
                            </template>
                            <template v-else>
                                <a-tooltip placement="topLeft" title="Click to kill this task!" arrow-point-at-center
                                    color="pink" :mouseEnterDelay="1.5">
                                    <a-button :icon="h(DeleteOutlined)" type="primary" danger disabled>Kill</a-button>
                                </a-tooltip>
                            </template>


                            <a-popconfirm title="Are you sure delete?" ok-text="Yes" cancel-text="No"
                                @confirm="deleteTask(record.task_id)">
                                <template #icon><question-circle-outlined style="color: red" /></template>
                                <a-tooltip placement="topLeft" title="Click to delete this task!" arrow-point-at-center
                                    color="red" :mouseEnterDelay="1.5">
                                    <a-button :icon="h(DeleteOutlined)" type="primary" danger>Delete</a-button>
                                </a-tooltip>
                            </a-popconfirm>
                        </a-space>
                    </template>

                </template>
                <template #summary>
                    <a-table-summary-row>
                        <a-table-summary-cell :col-span="7" align="right">
                            <a-typography-text>Task count: {{ tasks.length }}</a-typography-text>
                        </a-table-summary-cell>
                    </a-table-summary-row>
                </template>
            </a-table>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
            <a-card :bordered="false">
                <p>MySqlmap api web ui to manager scan tasks.</p>
            </a-card>

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
    PauseCircleOutlined,
    PlayCircleOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';

const name = ref('Home');
const router = useRouter();

const [api, contextHolder] = notification.useNotification();

const columns = ref([
    {
        title: '#',
        dataIndex: 'index'
    },
    {
        title: 'task id',
        dataIndex: 'task_id'
    },
    {
        title: 'errors',
        dataIndex: 'errors'
    },
    {
        title: 'logs',
        dataIndex: 'logs'
    },
    {
        title: 'status',
        dataIndex: 'status'
    },
    {
        title: 'injected',
        dataIndex: 'injected',
        filters: [
            {
                text: 'Injected',
                value: true,
            },
            {
                text: 'No injected',
                value: false,
            }
        ],
        onFilter: (value, record) => record.injected === value,
    },
    {
        title: 'Action',
        dataIndex: 'action'
    },
]);

const tasks = ref([]);

const openNotification = (title, desc) => {
    notification.open({
        message: title,
        description: desc
    });
};

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