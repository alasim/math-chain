export interface ThreadNode {
    id: string
    value: number
    operation?: string
    rightOperand?: number
    parentId?: string
    authorId: string
    authorUsername: string
    createdAt: string
    parentValue?: number
    children: ThreadNode[]
}