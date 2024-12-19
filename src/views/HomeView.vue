<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ApiService from '@/api'

import showToast from '@/services/toast'

import checkAuthToken from '@/services/token'

import auth from '@/auth'
const { checkIfUserIsAuthenticated, checkIfUserIsAdmin } = auth
const isAuthenticated = checkIfUserIsAuthenticated()
const isAdmin = checkIfUserIsAdmin()

const data = ref<any>(null)
const getBranch = async () => {
  if (checkAuthToken()) {
    try {
      const response = await ApiService.getBranchById(
        localStorage.getItem('token'),
        localStorage.getItem('branchId'),
      )
      data.value = response
    } catch (error: any) {
      data.value = null
      const errorMessage = error?.response?.data?.message || 'An error occurred.'
      showToast(errorMessage, 'destructive')
    }
  }
}

onMounted(() => {
  if (!isAdmin) {
    getBranch()
  }
})
</script>

<template>
  <h1 v-if="isAdmin">Hello Admin!</h1>
  <template v-else>
    <h1 v-if="data?.branch?.name">Hello! Your branch is "{{ data.branch.name }}".</h1>
    <h1 v-else>Loading branch data...</h1>
  </template>
</template>
