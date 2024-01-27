import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/healthcheck': 'http://localhost:5172',
            '/db': 'http://localhost:5172',
        },
    },
    plugins: [react()],
})
