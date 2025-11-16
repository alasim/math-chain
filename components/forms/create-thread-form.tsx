"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "../ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { CreateThreadFormSchema } from "./schema"
import { useTransition } from "react"
import { createStartNode } from "@/actions/calculation-node"
import { useRouter } from "next/navigation"



export const CreateThreadForm = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof CreateThreadFormSchema>>({
        resolver: zodResolver(CreateThreadFormSchema),
    })

    async function onSubmit(data: z.infer<typeof CreateThreadFormSchema>) {
        const res = await createStartNode({ value: data.startingNumber });

        if (res.success) {
            form.reset()
            router.push(`/chain/${res?.data?.id}`)
        } else {
            form.setError('startingNumber', {
                message: res.error
            })
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="startingNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Starting Number</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Enter a number..." {...field} className="text-center" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={form.formState.isSubmitting} type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2">Create Thread</Button>
            </form>
        </Form>
    )
}