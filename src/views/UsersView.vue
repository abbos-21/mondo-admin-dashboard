<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ApiService from '@/api'
import checkAuthToken from '@/services/token'
import showToast from '@/services/toast'

import auth from '@/auth'
const { checkIfUserIsAuthenticated, checkIfUserIsAdmin } = auth
const isAuthenticated = checkIfUserIsAuthenticated()
const isAdmin = checkIfUserIsAdmin()

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { PenLine, Trash2 } from 'lucide-vue-next'

const data = ref<any>(null)

const getAllUsers = async () => {
  if (checkAuthToken() && isAdmin) {
    try {
      const response = await ApiService.getAllUsers(localStorage.getItem('token'))
      data.value = response
    } catch (error: any) {
      data.value = null
      const errorMessage = error?.response?.data?.message || 'An error occurred.'
      showToast(errorMessage, 'destructive')
    }
  }
}

const branchesData = ref<any>(null)
const getAllBranches = async () => {
  try {
    const response = await ApiService.getAllBranches(localStorage.getItem('token'))
    branchesData.value = response
  } catch (error: any) {
    branchesData.value = null
    const errorMessage = error?.response?.data?.message || 'An error occurred.'
  }
}

const username = ref<string | null>(null)
const password = ref<string | null>(null)
const role = ref<string>('')
const branchId = ref<any>(null)

const createUser = async () => {
  try {
    const response = await ApiService.createUser(
      localStorage.getItem('token'),
      username.value,
      password.value,
      branchId.value,
    )
    showToast(response.message)
    getAllUsers()

    username.value = null
    password.value = null
    branchId.value = null
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'An error occurred.'
    showToast(errorMessage, 'destructive')
  }
}

const createAdmin = async () => {
  try {
    const response = await ApiService.createAdmin(
      localStorage.getItem('token'),
      username.value,
      password.value,
    )
    showToast(response.message)
    getAllUsers()

    username.value = null
    password.value = null
    branchId.value = null
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'An error occurred.'
    showToast(errorMessage, 'destructive')
  }
}

onMounted(() => {
  getAllBranches()
  getAllUsers()
})
</script>

<template>
  <div class="mb-4">
    <Dialog>
      <DialogTrigger as-child>
        <Button> Add a user </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a user</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi, praesentium!
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="role === 'user' ? createUser() : createAdmin()">
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="username" class="text-right"> Username </Label>
              <Input
                id="username"
                type="text"
                class="col-span-3"
                v-model="username as string"
                required
              />
            </div>

            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="password" class="text-right"> Password </Label>
              <Input
                id="password"
                type="text"
                class="col-span-3"
                v-model="password as string"
                required
              />
            </div>

            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="role" class="text-right"> Role </Label>
              <Select required id="role" v-model="role">
                <SelectTrigger class="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="user"> User </SelectItem>
                    <SelectItem value="admin"> Admin </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="branch" class="text-right"> Branch </Label>
              <Select id="branch" :disabled="role === 'admin'" v-model="branchId">
                <SelectTrigger class="col-span-3">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="branch in branchesData.branches"
                      :key="branch.id"
                      :value="branch.id"
                    >
                      {{ branch.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" class="float-right"> Create </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>

  <Table>
    <TableCaption>A list of orders.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead> ID </TableHead>
        <TableHead>Username</TableHead>
        <TableHead>Branch</TableHead>
        <TableHead>Role</TableHead>
        <TableHead class="text-right"> Actions </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-if="data" v-for="user in data.users" :key="user.id">
        <TableCell class="font-medium">{{ user.id }}</TableCell>
        <TableCell>{{ user.username }}</TableCell>
        <TableCell>{{ user.branch ? user.branch.name : 'None' }}</TableCell>
        <TableCell>{{ user.isAdmin ? 'Admin' : 'User' }}</TableCell>
        <TableCell class="flex justify-end gap-2">
          <Button variant="outline" size="icon" aria-label="Edit">
            <PenLine />
          </Button>
          <Button variant="destructive" size="icon" aria-label="Delete">
            <Trash2 />
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
