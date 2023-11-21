import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'D:/work_places/devs/python-devs/mySqlmap/lib/utils/api/dist' // 指定编译目标路径为dist目录
  },
})
