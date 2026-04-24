import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'

import './styles.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(VueQueryPlugin)
// app.use(VueQueryPlugin, {
//   queryClientConfig: {
//     defaultOptions: {
//       queries: {
//         staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
//         gcTime: 1000 * 60 * 10, // Unused data is kept in cache for 10 minutes
//       },
//     },
//   },
// })

app.mount('#app')
