<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ApiService from '@/api'
import checkAuthToken from '@/services/token'
import showToast from '@/services/toast'

import auth from '@/auth'
const { checkIfUserIsAuthenticated, checkIfUserIsAdmin } = auth
const isAuthenticated = checkIfUserIsAuthenticated()
const isAdmin = checkIfUserIsAdmin()

import { API_URL } from '@/api'

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
import Badge from '@/components/ui/badge/Badge.vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Check, X, Info } from 'lucide-vue-next'

const data = ref<any>(null)
const previousOrders = ref<any>([])

const newOrderSound = new Audio('/notification.mp3')

const getAllOrders = async () => {
  if (checkAuthToken()) {
    try {
      const response = await ApiService.getAllOrders(localStorage.getItem('token'))
      data.value = response
    } catch (error: any) {
      data.value = null
      const errorMessage = error?.response?.data?.message || 'An error occurred.'
      showToast(errorMessage, 'destructive')
    }
  }
}

const getAllOrdersInSpecificBranch = async () => {
  if (checkAuthToken()) {
    try {
      const response = await ApiService.getAllOrdersInSpecificBranch(
        localStorage.getItem('token'),
        Number(localStorage.getItem('branchId')),
      )

      if (data.value?.orders?.length < response.orders.length) {
        newOrderSound.play()
        showToast('New order received!', 'default')
      }

      data.value = response
      console.log(data.value)
      previousOrders.value = [...response.orders]
    } catch (error: any) {
      data.value = null
      const errorMessage = error?.response?.data?.message || 'An error occurred.'
      // showToast(errorMessage, 'destructive')
    }
  }
}

const pollInterval = 1000
const startPolling = () => {
  setInterval(async () => {
    await getAllOrdersInSpecificBranch()
  }, pollInterval)
}

const formatDate = (date: any) => {
  return new Date(date).toLocaleString()
}

const parseImgUrl = (imgUrls: string) => {
  try {
    const parsed = JSON.parse(imgUrls)
    return Array.isArray(parsed) ? parsed[0] : null
  } catch {
    return null
  }
}

onMounted(() => {
  if (isAdmin) {
    getAllOrders()
  } else {
    startPolling()
  }
})
</script>

<template>
  <Table>
    <TableCaption>A list of orders.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead> ID </TableHead>
        <TableHead>Order info</TableHead>
        <TableHead>Status</TableHead>
        <TableHead class="text-right"> Actions </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-if="data" v-for="order in data.orders" :key="order.id">
        <TableCell class="font-medium">{{ order.id }}</TableCell>
        <TableCell>
          <Dialog>
            <DialogTrigger as-child>
              <Button size="icon" variant="ghost" aria-label="View Order Info">
                <Info />
              </Button>
            </DialogTrigger>

            <DialogScrollContent class="p-6 max-w-lg rounded-lg shadow-lg sm:max-w-[425px]">
              <DialogHeader class="mb-4">
                <DialogTitle class="text-xl font-bold">Order Information</DialogTitle>
              </DialogHeader>

              <div class="space-y-4 text-sm">
                <div>
                  <strong class="block">Client Phone:</strong>
                  <span>{{ order.clientTel }}</span>
                </div>
                <div>
                  <strong class="block">Client Name:</strong>
                  <span>{{ order.clientName }}</span>
                </div>
                <div>
                  <strong class="block">Client Location:</strong>
                  <span>{{ order.clientLocation }}</span>
                </div>
                <div>
                  <strong class="block">Order Date:</strong>
                  <span>{{ formatDate(order.createdAt) }}</span>
                </div>
                <div>
                  <strong class="block">Order ID:</strong>
                  <span>{{ order.id }}</span>
                </div>

                <div class="mt-6">
                  <strong class="text-sm">Products:</strong>
                  <ul class="mt-2 space-y-4">
                    <li
                      v-for="product in order.products"
                      :key="product.id"
                      class="flex gap-4 items-start"
                    >
                      <img
                        :src="`${API_URL}${parseImgUrl(product.imgUrls)}`"
                        :alt="product.name"
                        class="w-24 h-24 object-cover rounded shadow-sm"
                      />

                      <div class="text-sm flex-1">
                        <div>
                          <strong class="block">Name:</strong>
                          <span>{{ product.name }}</span>
                        </div>
                        <div>
                          <strong class="block">Price:</strong>
                          <span>{{ product.price }} UZS</span>
                        </div>
                        <div>
                          <strong class="block">Description:</strong>
                          <span>{{ product.description }}</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div class="mt-6 text-sm">
                  <strong class="block">Total Products:</strong>
                  <span>{{ order._count.products }}</span>
                </div>
              </div>
            </DialogScrollContent>
          </Dialog>
        </TableCell>
        <TableCell>
          <Badge
            :variant="
              order.status === 'PENDING'
                ? 'warning'
                : order.status === 'PAID'
                  ? 'success'
                  : 'destructive'
            "
          >
            {{ order.status }}
          </Badge>
        </TableCell>
        <TableCell class="flex justify-end gap-2">
          <Button variant="outline" size="icon">
            <Check />
          </Button>

          <Button variant="destructive" size="icon">
            <X />
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
