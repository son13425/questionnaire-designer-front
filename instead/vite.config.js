import Inspect from 'vite-plugin-inspect'
import { resolve } from 'path'


export default {
    plugins: [
        Inspect()
    ],
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'src/form/index.html')
            }
        }
    }
}