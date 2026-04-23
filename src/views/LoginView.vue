<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// storeToRef helps detructuring store and making it a ref
// const store = useAuthStore()
// const { isLoggedIn } = storeToRefs(store)

const form = reactive<{
  email: string
  password: string
}>({ email: '', password: '' })

const { login } = useAuthStore()

const route = useRoute()
const router = useRouter()

const loginForm = async () => {
  if (form.email && form.password) {
    const path = route.query?.redirect?.toString() ?? 'explore'

    await login(form.email)

    router.push({ path })

    return
  }
}
</script>

<template>
  <section>
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Sign in to your account
          </h1>

          <form class="space-y-4 md:space-y-6" novalidate @submit.prevent="loginForm">
            <BaseInput
              id="email"
              v-model="form.email"
              label="Email"
              placeholder="Enter a valid email"
              type="email"
            />
            <BaseInput
              id="password"
              v-model="form.password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
            <BaseButton type="submit" :disabled="!form.email || !form.password">
              Sign in
            </BaseButton>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
