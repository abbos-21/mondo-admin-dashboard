<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ApiService from '@/api'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import showToast from '@/services/toast'

const username = ref<string>('')
const password = ref<string>('')

const login = async () => {
  if (!username.value || !password.value) {
    return showToast('Please enter both username and password', 'destructive')
  }

  try {
    const response = await ApiService.login(username.value, password.value)
    localStorage.setItem('token', response.token)
    localStorage.setItem('isAdmin', response.isAdmin)
    localStorage.setItem('branchId', response.branchId)
    showToast(response.message)
    location.reload()
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'An error occurred.'
    showToast(errorMessage, 'destructive')
  }
}

onMounted(() => {
  localStorage.clear()
})
</script>

<template>
  <main class="min-h-screen flex flex-col justify-center items-center">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl"> Login </CardTitle>
      </CardHeader>
      <form @submit.prevent="login">
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="username">Username</Label>
            <Input id="username" type="text" v-model="username" required />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input id="password" type="password" v-model="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button class="w-full" type="submit"> Sign in </Button>
        </CardFooter>
      </form>
    </Card>
  </main>
</template>
