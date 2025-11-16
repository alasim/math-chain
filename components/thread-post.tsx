'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getSign } from '@/lib/tree'
import { ThreadNode } from '@/type'
import { addOperation } from '@/actions/calculation-node'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { ReplyFormSchema } from './forms/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem } from './ui/form'

interface ThreadPostProps {
  node: ThreadNode
  onReply: (nodeId: string, operation: string, rightOperand: number) => void
  isRoot?: boolean
  depth?: number
}



export default function ThreadPost({
  node,
  onReply,
  isRoot,
  depth = 0,
}: ThreadPostProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  const form = useForm<z.infer<typeof ReplyFormSchema>>({
    resolver: zodResolver(ReplyFormSchema),
  })
  const {
    id,
    value,
    operation,
    rightOperand,
    authorUsername,
    createdAt,
    parentValue,
  } = node

  const initials = authorUsername
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()


  const handleSubmitReply = async (data: z.infer<typeof ReplyFormSchema>) => {
    const res = await addOperation({
      operation: data.operation,
      rightOperand: data.rightOperand,
      parentId: id,
    });

    if (res.success) {
      onReply(id, data.operation, data.rightOperand);
      form.reset();
      setShowReplyForm(false);
    }
  };

  return (
    <div style={{ marginLeft: `${depth * 32}px` }} className="relative">
      <div className="flex gap-3 pt-4 pr-4 border-b border-border last:border-b-0">
        {/* Avatar and Author */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <p className="text-xs font-medium text-foreground text-center w-12 break-words">
            {authorUsername}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground mb-2">{new Date(createdAt).toLocaleString()}</div>

          {isRoot ? (
            <div>
              <div className="mb-3">
                <div className="text-sm font-medium text-muted-foreground">Starting number</div>
                <div className="text-3xl font-bold text-primary">{value}</div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-3 p-3 bg-secondary/50 rounded border border-border">
                <div className="text-sm font-mono">
                  <span className="font-semibold text-foreground">{parentValue}</span>
                  <span className="mx-2 text-primary font-bold">{getSign(operation as "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE")}</span>
                  <span className="font-semibold text-foreground">{rightOperand}</span>
                  <span className="mx-2 text-muted-foreground">=</span>
                  <span className="font-bold text-xl text-primary">{value}</span>
                </div>
              </div>
            </div>
          )}

          {/* Reply Button */}
          <Button
            onClick={() => setShowReplyForm(!showReplyForm)}
            variant="ghost"
            className="text-primary hover:text-primary/80 p-0 h-auto font-normal text-sm bg-transparent hover:bg-transparent"
          >
            {showReplyForm ? '✕ Cancel' : '↳ Calculate'}
          </Button>

          {showReplyForm && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmitReply)}

                className="mt-3 p-4 bg-secondary/20 rounded-lg border border-border space-y-3"
              >
                <div className="flex gap-2 items-center">
                  <div className="text-lg font-bold text-primary min-w-fit">{value}</div>
                  <FormField
                    control={form.control}
                    name="operation"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value} >
                          <SelectTrigger className="w-16">
                            <SelectValue className="text-lg" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem className='text-lg' value="ADD">+</SelectItem>
                            <SelectItem value="SUBTRACT">−</SelectItem>
                            <SelectItem value="MULTIPLY">×</SelectItem>
                            <SelectItem value="DIVIDE">÷</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rightOperand"
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          type="number"
                          placeholder="Right Number"
                          value={field.value}
                          onChange={field.onChange}
                          className="flex-1"
                          step="any"
                        />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="sm"
                    disabled={form.formState.isSubmitting}
                  >
                    Publish
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  )
}
