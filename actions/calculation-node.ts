"use server";


import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { performOperation } from "@/lib/tree";
import { revalidatePath } from "next/cache";
import { z } from "zod";


const startSchema = z.object({
    value: z.number(),
});

export async function createStartNode(form: z.infer<typeof startSchema>) {
    const user = await getCurrentUser();

    if (!user) throw new Error("Not authenticated");

    try {
        const node = await prisma.calculationNode.create({
            data: {
                authorId: user.id,
                value: form.value,
            },
        });
        return {
            success: true,
            data: node,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
}


const opSchema = z.object({
    parentId: z.string(),
    operation: z.enum(["ADD", "SUBTRACT", "MULTIPLY", "DIVIDE"]),
    rightOperand: z.number(),
});

export async function addOperation(form: z.infer<typeof opSchema>) {

    const user = await getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    const { parentId, operation, rightOperand } = opSchema.parse(form);

    const parent = await prisma.calculationNode.findUnique({
        where: { id: parentId },
    });

    if (!parent) throw new Error("Parent node does not exist");

    const newValue = performOperation(parent.value, operation, rightOperand);

    const node = await prisma.calculationNode.create({
        data: {
            parentId,
            authorId: user.id,
            operation,
            rightOperand,
            value: newValue,
        },
    });
    revalidatePath(`/chain/${parentId}`);
    return {
        success: true,
        data: node,
    };
}