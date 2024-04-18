import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import { qrcode } from 'vite-plugin-qrcode'
import Terminal from 'vite-plugin-terminal'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: '/canvas-animation/',
  plugins: [tsconfigPaths(), Terminal(), mkcert(), qrcode()],
  server: {
    https: true,
  },
})
