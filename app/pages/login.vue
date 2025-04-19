<script lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import * as z from 'zod';

const fields = [{
  name: 'email',
  type: 'text' as const,
  label: 'Email',
  placeholder: 'Enter your email',
  required: true,
}, {
  name: 'password',
  label: 'Password',
  type: 'password' as const,
  placeholder: 'Enter your password',
}, {
  name: 'remember',
  label: 'Remember me',
  type: 'checkbox' as const,
}];

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
});
type Schema = z.output<typeof schema>;
</script>

<script setup lang="ts">
const supa = useSupabaseClient();
const toast = useToast();

const status = ref<'loading' | 'idle' | 'done'>('idle');
whenever(
  () => status.value === 'done',
  () => navigateTo('/'),
);

if (useSupabaseSession().value)
  status.value = 'done';

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  status.value = 'loading';
  try {
    await supa.auth.signInWithPassword({
      email: payload.data.email,
      password: payload.data.password,
    });
    toast.add({
      title: 'Welcome',
      description: 'You have successfully logged in. Redirecting...',
    });
    status.value = 'done';
  } catch (e) {
    console.error(e);
    toast.add({
      title: 'Failed',
      description: 'Login failed. Checkout DevTools for more info and try again later.',
    });
    status.value = 'idle';
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields
        :disabled="loading"
        :loading
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>
