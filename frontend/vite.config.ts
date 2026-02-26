import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< HEAD
import tailwindcss from '@tailwindcss/vite'
=======
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27

// https://vite.dev/config/
export default defineConfig({
  plugins: [
<<<<<<< HEAD
    tailwindcss(),
=======
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
})
