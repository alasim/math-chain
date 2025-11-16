"use server"

import { AuthFormSchema } from "@/components/forms/schema";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import z from "zod";

export const createUser = async (formData: z.infer<typeof AuthFormSchema>) => {

    const safeParse = AuthFormSchema.safeParse(formData);

    if (!safeParse.success) return;
    const { username, password } = safeParse.data;
    // check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            username,
        }
    })
    if (existingUser) {
        return {
            message: "User already exists",
            success: false,
        }
    }

    const hashedPassword = hashPassword(password);

    const user = await prisma.user.create({
        data: {
            username,
            passwordHash: hashedPassword,
        }
    })

    return {
        message: "User created successfully",
        success: true,
    }
}
