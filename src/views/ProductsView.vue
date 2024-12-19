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

interface Product {
  id: number
  name: string
  price: number
  description: string
  imgUrls: string
}

const data = ref<{ products: Product[] } | null>(null)
const getAllProducts = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      showToast('Authentication token is missing.', 'destructive')
      return
    }

    const response = await ApiService.getAllProducts(token)
    data.value = response
  } catch (error: any) {
    data.value = null
    const errorMessage = error?.response?.data?.message || 'An error occurred.'
    showToast(errorMessage, 'destructive')
  }
}

const productName = ref<string | null>(null)
const productPrice = ref<number | null>(null)
const productDescription = ref<string | null>(null)

const createProduct = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    showToast('Authentication token is missing', 'destructive')
    return
  }

  if (!productName || !productPrice) {
    return showToast('Product name and price are required')
  }

  if (selectedFiles.value.length === 0) {
    showToast('No files selected', 'destructive')
    return
  }

  try {
    const response = await ApiService.createProduct(
      localStorage.getItem('token'),
      productName.value,
      productPrice.value,
      productDescription.value,
    )

    await ApiService.attachImagesToProduct(token, response.newProduct.id, selectedFiles.value)

    getAllProducts()

    showToast(response.message)

    productName.value = null
    productPrice.value = null
    productDescription.value = null
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'An error occurred.'
    showToast(errorMessage, 'destructive')
  } finally {
    selectedFiles.value = []
  }
}

const deleteProduct = async (productId: number | null) => {
  if (checkAuthToken()) {
    try {
      const response = await ApiService.deleteProduct(localStorage.getItem('token'), productId)
      showToast(response.message)
      getAllProducts()
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'An error occurred.'
      showToast(errorMessage, 'destructive')
    }
  }
}

const selectedFiles = ref<File[]>([])

const handleFileSelection = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    selectedFiles.value = Array.from(target.files)
  }
}

const uploadImages = async (productId: number) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      showToast('Authentication token is missing', 'destructive')
      return
    }

    if (selectedFiles.value.length === 0) {
      showToast('No files selected', 'destructive')
      return
    }

    const response = await ApiService.attachImagesToProduct(token, productId, selectedFiles.value)
    showToast(response.message)

    getAllProducts()
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'An error occurred.'
    showToast(errorMessage, 'destructive')
  } finally {
    selectedFiles.value = []
  }
}

const deleteImage = async (productId: number, imageUrl: string) => {
  const token = localStorage.getItem('token')
  if (!token) {
    showToast('Authentication token is missing', 'destructive')
    return
  }

  try {
    const response = await ApiService.deleteProductImage(token, productId, imageUrl)
    showToast(response.message)
    getAllProducts()
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'An error occurred.'
    showToast(errorMessage, 'destructive')
  }
}

const updateImage = async (productId: number, oldImageUrl: string, file: File) => {
  const token = localStorage.getItem('token')
  if (!token) {
    showToast('Authentication token is missing', 'destructive')
    return
  }

  try {
    const response = await ApiService.updateProductImage(token, productId, oldImageUrl, file)
    showToast(response.message)
    getAllProducts()
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'An error occurred.'
    showToast(errorMessage, 'destructive')
  }
}

onMounted(() => {
  getAllProducts()
})
</script>

<template>
  <div class="mb-4">
    <Dialog>
      <DialogTrigger as-child>
        <Button> Add a product </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a product</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi, praesentium!
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="createProduct">
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="name" class="text-right"> Name </Label>
              <Input
                id="name"
                type="text"
                class="col-span-3"
                required
                v-model="productName as string"
              />
            </div>

            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="price" class="text-right"> Price </Label>
              <Input
                id="price"
                type="number"
                class="col-span-3"
                required
                v-model="productPrice as number"
              />
            </div>

            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="description" class="text-right"> Description </Label>
              <Input
                id="description"
                type="text"
                class="col-span-3"
                v-model="productDescription as string"
              />
            </div>

            <div class="flex items-center gap-4">
              <Label for="images"> Images </Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                @change="handleFileSelection"
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
    <TableCaption>A list of products.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>ID</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Description</TableHead>
        <TableHead>Images</TableHead>
        <TableHead class="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="product in data?.products || []" :key="product.id">
        <TableCell class="font-medium">{{ product.id }}</TableCell>
        <TableCell>{{ product.name }}</TableCell>
        <TableCell>{{ product.price }} UZS</TableCell>
        <TableCell>{{ product.description }}</TableCell>
        <TableCell>
          <Dialog>
            <DialogTrigger as-child>
              <Button variant="outline" size="icon" aria-label="View product images">
                <Eye />
              </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Images of product "{{ product.name }}"</DialogTitle>
              </DialogHeader>

              <div v-if="!product.imgUrls || JSON.parse(product.imgUrls).length === 0">
                <p class="text-gray-500">No images attached to product "{{ product.name }}".</p>
                <form @submit.prevent="uploadImages(product.id)" class="mt-2">
                  <div class="grid grid-cols-4 items-center">
                    <Label for="imageAdd">Add one</Label>
                    <Input
                      id="imageAdd"
                      class="col-span-3"
                      type="file"
                      multiple
                      accept="image/*"
                      @change="handleFileSelection"
                    />
                  </div>

                  <Button type="submit" class="mt-2 float-right">Save</Button>
                </form>
              </div>

              <div v-else>
                <div
                  v-for="imageUrl in JSON.parse(product.imgUrls)"
                  :key="imageUrl"
                  class="flex items-center gap-4 border p-4 rounded-lg shadow-sm mb-2"
                >
                  <img
                    :src="`${API_URL}${imageUrl}`"
                    alt="Product Image"
                    class="w-16 h-16 object-cover rounded"
                  />

                  <div class="flex flex-col gap-2">
                    <Label for="imageUpdate">Update</Label>
                    <Input
                      id="imageUpdate"
                      type="file"
                      @change="(e: any) => updateImage(product.id, imageUrl, e.target.files[0])"
                    />
                  </div>

                  <Button
                    variant="destructive"
                    size="icon"
                    @click="deleteImage(product.id, imageUrl)"
                  >
                    <Trash2 />
                  </Button>
                </div>

                <form @submit.prevent="uploadImages(product.id)" class="my-4">
                  <div class="grid grid-cols-4 items-center">
                    <Label for="imageAdd">Attach one more</Label>
                    <Input
                      id="imageAdd"
                      class="col-span-3"
                      type="file"
                      multiple
                      accept="image/*"
                      @change="handleFileSelection"
                    />
                  </div>

                  <Button type="submit" class="mt-2 float-right">Attach</Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </TableCell>
        <TableCell class="flex justify-end gap-2">
          <Button variant="outline" size="icon" aria-label="Edit">
            <PenLine />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            aria-label="Delete"
            @click="deleteProduct(product.id)"
          >
            <Trash2 />
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
