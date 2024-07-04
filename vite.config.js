export default {
    base: '/questionnaire-designer-front/',
    build: {
        rollupOptions: {
            input: {
                main: '/index.html',
                form: '/src/form/index.html'
            }
        }
    }
}