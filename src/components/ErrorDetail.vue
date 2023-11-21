<!-- ErrorDetail.vue -->

<template>
    <div>
        <h1>Error Detail</h1>
        <p>Task ID: {{ taskId }}</p>

        <!-- 错误详情页的具体内容 -->
        
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const name = ref('ErrorDetail');
const taskId = ref('');
onMounted(() => {
    {
        taskId.value = useRoute().params.taskId;
    }
})
</script>