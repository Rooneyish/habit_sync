import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // If your repo is habit_sync, keep this. 
  // If your repo is habitsync-bw, change it to '/habitsync-bw/'
  base: '/habit_sync/', 
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    outDir: 'dist',
  }
});