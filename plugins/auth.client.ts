import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin({
  name: 'auth-restore',
  enforce: 'post',
  setup() {
    const auth = useAuthStore()
    auth.restore()
  },
})
