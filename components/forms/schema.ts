import { z } from "zod"

export const AuthFormSchema = z.object({
    username: z.string(),
    password: z.string(),
})

export const CreateThreadFormSchema = z.object({
    startingNumber: z.coerce.number(),
})

export const ReplyFormSchema = z.object({
    operation: z.enum(['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE']),
    rightOperand: z.coerce.number(),
});