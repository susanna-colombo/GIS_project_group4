import { defineConfig } from 'vite';
import { glob } from 'glob';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        workflow: path.resolve(__dirname, 'pages/workflow.html'),
        results: path.resolve(__dirname, 'pages/results.html'),
        webgis: path.resolve(__dirname, 'pages/webgis.html'),
      },
    },
  },
});