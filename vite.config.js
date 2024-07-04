import { resolve } from 'path'


export default {
    base: '/questionnaire-designer-front/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'src/form/index.html')
            }
        }
    }
}