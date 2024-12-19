<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ApiService from '@/api'
import showToast from '@/services/toast'
import { API_URL } from '@/api'
import checkAuthToken from '@/services/token'

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
import { Trash2, PenLine, Eye } from 'lucide-vue-next'
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

interface Branch {
  id: number
  name: string
  location: number
  users: object
  imgUrl: string
}

const data = ref<{ branches: Branch[] } | null>(null)

const getAllBranches = async () => {
  if (checkAuthToken()) {
    try {
      const response = await ApiService.getAllBranches(localStorage.getItem('token'))
      data.value = response
    } catch (error: any) {
      data.value = null
      const errorMessage = error?.response?.data?.message || 'An error occurred.'
      showToast(errorMessage, 'destructive')
    }
  }
}

const branchName = ref<string | null>(null)
const branchLocation = ref<string | null>(null)

const createBranch = async () => {
  if (checkAuthToken()) {
    try {
      const response = await ApiService.createBranch(
        localStorage.getItem('token'),
        branchName.value,
        branchLocation.value,
      )

      showToast(response.message)
      getAllBranches()
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'An error occurred.'
      showToast(errorMessage, 'destructive')
    }
  }
}

onMounted(() => {
  getAllBranches()
})
</script>

<template>
  <div class="mb-4">
    <Dialog>
      <DialogTrigger as-child>
        <Button> Add a branch </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a product</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi, praesentium!
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="createBranch()">
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="name" class="text-right"> Name </Label>
              <Input
                id="name"
                type="text"
                class="col-span-3"
                required
                v-model="branchName as string"
              />
            </div>

            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="location" class="text-right"> Location </Label>
              <Input
                id="location"
                type="text"
                class="col-span-3"
                required
                v-model="branchLocation as string"
              />
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
    <TableCaption>A list of branches</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>ID</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Location</TableHead>
        <TableHead class="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="branch in data?.branches || []" :key="branch.id">
        <TableCell class="font-medium">{{ branch.id }}</TableCell>
        <TableCell>{{ branch.name }}</TableCell>
        <TableCell>{{ branch.location }}</TableCell>
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
