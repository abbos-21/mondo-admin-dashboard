import axios from 'axios'

export const API_URL = 'http://localhost:3000'

const ApiService = {
  // Auth
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      })
      return response.data
    } catch (error: any) {
      console.error('Error logging in: ', error)
      throw error
    }
  },

  // Products
  getAllProducts: async (token: string | null) => {
    try {
      const response = await axios.get(`${API_URL}/info/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('Error getting all products: ', error)
      throw error
    }
  },

  createProduct: async (
    token: string | null,
    name: string | null,
    price: number | null,
    description: string | null,
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/product`,
        { name, price, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error: any) {
      console.error('Error creating a product: ', error)
      throw error
    }
  },

  deleteProduct: async (token: string | null, id: number | null) => {
    try {
      const response = await axios.delete(`${API_URL}/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('Error deleting a product: ', error)
      throw error
    }
  },

  attachImagesToProduct: async (token: string | null, productId: number, files: File[]) => {
    try {
      const formData = new FormData()
      files.forEach((file) => formData.append('images', file))

      const response = await axios.post(`${API_URL}/upload/product/${productId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data
    } catch (error: any) {
      console.error('Error attaching images to product: ', error)
      throw error
    }
  },

  deleteProductImage: async (token: string | null, productId: number, imageUrl: string) => {
    try {
      const response = await axios.delete(`${API_URL}/upload/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { imageUrl },
      })
      return response.data
    } catch (error: any) {
      console.error('Error deleting product image: ', error)
      throw error
    }
  },

  updateProductImage: async (
    token: string | null,
    productId: number,
    oldImageUrl: string,
    file: File,
  ) => {
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('oldImageUrl', oldImageUrl)

      const response = await axios.put(`${API_URL}/upload/product/${productId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error: any) {
      console.error('Error updating product image: ', error)
      throw error
    }
  },

  // Branchs
  getAllBranches: async (token: string | null) => {
    try {
      const response = await axios.get(`${API_URL}/info/branches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('Error getting all branches: ', error)
      throw error
    }
  },

  getBranchById: async (token: string | null, branchId: string | null) => {
    try {
      const response = await axios.get(`${API_URL}/info/branch?id=${branchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('Error getting branch by ID: ', error)
      throw error
    }
  },

  createBranch: async (token: string | null, name: string | null, location: string | null) => {
    try {
      const response = await axios.post(
        `${API_URL}/branch`,
        { name, location },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error: any) {
      console.error('Error creating a branch: ', error)
      throw error
    }
  },

  // Orders
  getAllOrders: async (token: string | null) => {
    try {
      const response = await axios.get(`${API_URL}/info/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('Error getting all orders: ', error)
      throw error
    }
  },

  getAllOrdersInSpecificBranch: async (token: string | null, branchId: number | null) => {
    try {
      const response = await axios.get(`${API_URL}/info/orders/branch/${branchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('Error getting all orders: ', error)
      throw error
    }
  },

  // Users
  getAllUsers: async (token: string | null) => {
    try {
      const response = await axios.get(`${API_URL}/info/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('Error getting all users: ', error)
      throw error
    }
  },

  createUser: async (
    token: string | null,
    username: string | null,
    password: string | null,
    branchId: number | null,
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/user`,
        {
          username,
          password,
          branchId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error: any) {
      console.error('Error creating a user: ', error)
      throw error
    }
  },

  createAdmin: async (token: string | null, username: string | null, password: string | null) => {
    try {
      const response = await axios.post(
        `${API_URL}/user/admin`,
        {
          username,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error: any) {
      console.error('Error creating an admin: ', error)
      throw error
    }
  },
}

export default ApiService
