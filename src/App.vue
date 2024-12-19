<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router'

import auth from './auth'
const { checkIfUserIsAuthenticated, checkIfUserIsAdmin } = auth
const isAuthenticated = checkIfUserIsAuthenticated()
const isAdmin = checkIfUserIsAdmin()

import Toaster from '@/components/ui/toast/Toaster.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Bell,
  CircleUser,
  Home,
  Menu,
  Package2,
  Users,
  Network,
  IceCreamCone,
  Package,
} from 'lucide-vue-next'

const route = useRoute()

const getLinkClass = (path: string) => {
  return route.path === path ? 'bg-muted text-primary' : 'text-muted-foreground'
}

const logout = () => {
  localStorage.clear()
  location.reload()
}
</script>

<template>
  <Toaster />

  <div
    v-if="isAuthenticated"
    class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
  >
    <div class="hidden border-r bg-muted/40 md:block">
      <div class="flex h-full max-h-screen flex-col gap-2">
        <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <RouterLink to="/" class="flex items-center gap-2 font-semibold">
            <Package2 class="h-6 w-6" />
            <span class="">Mondo Inc</span>
          </RouterLink>
          <Button variant="outline" size="icon" class="ml-auto h-8 w-8">
            <Bell class="h-4 w-4" />
            <span class="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div class="flex-1">
          <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
            <RouterLink
              to="/"
              :class="getLinkClass('/')"
              class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
            >
              <Home class="h-4 w-4" />
              Home
            </RouterLink>
            <RouterLink
              to="/orders"
              :class="getLinkClass('/orders')"
              class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
            >
              <Package class="h-4 w-4" />
              Orders
              <Badge class="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                6
              </Badge>
            </RouterLink>
            <RouterLink
              v-if="isAdmin"
              to="/products"
              :class="getLinkClass('/products')"
              class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
            >
              <IceCreamCone class="h-4 w-4" />
              Products
            </RouterLink>
            <RouterLink
              v-if="isAdmin"
              to="/users"
              :class="getLinkClass('/users')"
              class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
            >
              <Users class="h-4 w-4" />
              Users
            </RouterLink>

            <RouterLink
              v-if="isAdmin"
              to="/branches"
              :class="getLinkClass('/branches')"
              class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
            >
              <Network class="h-4 w-4" />
              Branches
            </RouterLink>
          </nav>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <header
        class="flex h-14 items-center justify-between md:justify-end border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6"
      >
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="outline" size="icon" class="shrink-0 md:hidden">
              <Menu class="h-5 w-5" />
              <span class="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="flex flex-col">
            <nav class="grid gap-2 text-lg font-medium">
              <RouterLink to="/" class="flex items-center gap-2 text-lg font-semibold">
                <Package2 class="h-6 w-6" />
                <span class="sr-only">Acme Inc</span>
              </RouterLink>

              <RouterLink
                to="/"
                :class="[
                  getLinkClass('/'),
                  'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground',
                ]"
              >
                <Home class="h-5 w-5" />
                Home
              </RouterLink>

              <RouterLink
                to="/orders"
                :class="[
                  getLinkClass('/orders'),
                  'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground',
                ]"
              >
                <Package class="h-5 w-5" />
                Orders
                <Badge
                  class="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                >
                  6
                </Badge>
              </RouterLink>

              <RouterLink
                v-if="isAdmin"
                to="/products"
                :class="[
                  getLinkClass('/products'),
                  'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground',
                ]"
              >
                <IceCreamCone class="h-5 w-5" />
                Products
              </RouterLink>

              <RouterLink
                v-if="isAdmin"
                to="/users"
                :class="[
                  getLinkClass('/users'),
                  'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground',
                ]"
              >
                <Users class="h-5 w-5" />
                Users
              </RouterLink>

              <RouterLink
                v-if="isAdmin"
                to="/branches"
                :class="[
                  getLinkClass('/branches'),
                  'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground',
                ]"
              >
                <Network class="h-5 w-5" />
                Branches
              </RouterLink>
            </nav>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="rounded-full">
              <CircleUser class="h-5 w-5" />
              <span class="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="logout">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main class="p-4">
        <RouterView />
      </main>
    </div>
  </div>

  <RouterView v-else />
</template>

<style scoped></style>
