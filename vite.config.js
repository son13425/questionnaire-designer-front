export default {
    // base: '/questionnaire-designer-front/',
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                form: 'src/form/index.html',
                reg: 'src/reg/index.html',
                ankets: 'src/ankets/index.html'
            }
        }
    },
}
