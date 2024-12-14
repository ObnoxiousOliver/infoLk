import App from './App.vue'
import { createApp } from 'vue'
import './assets/scss/index.scss'
import { router } from './router'

createApp(App)
  .use(router)
  .mount('#app')
