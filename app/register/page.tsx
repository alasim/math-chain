'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Header from '@/components/header'
import { useForm } from 'react-hook-form'
import { AuthFormSchema } from '@/components/forms/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { createUser } from '@/actions/auth'

export default function RegisterPage() {
  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
  })

  async function onSubmit(data: z.infer<typeof AuthFormSchema>) {
    const res = await createUser(data)
    console.log("🚀 ~ onSubmit ~ res:", res)
    if (!res?.success) {
      form.setError('username', {
        message: res?.message || 'Username already exists'
      })
    } else {
      form.reset();
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md p-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Sign Up</h1>
            <p className="text-muted-foreground mb-6">
              Create a new account to start interacting with MathChains
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter your username..." {...field} className="block text-sm font-medium text-foreground mb-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password..." {...field} className="block text-sm font-medium text-foreground mb-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </Form>

          {form.formState.isSubmitSuccessful && (
            <div className="text-center font-medium">
              <span className="text-green-500">Success!</span> <br /> Please sign in to continue.
            </div>
          )}

          <p className="text-center text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </Card>
      </main>
    </div>
  )
}
