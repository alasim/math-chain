// 'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import ThreadView from '@/components/thread-view'

import { fetchFullTree } from '@/actions/tree'


interface ThreadPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ThreadPage(props: ThreadPageProps) {

  const params = await props.params
  const response = await fetchFullTree(params?.id as string)



  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-primary">
              ← Back to Chains
            </Button>
          </Link>
        </div>
        <div className="bg-card rounded-lg border border-border">
          <ThreadView data={JSON.parse(JSON.stringify(response))} />
        </div>
      </main>
    </div>
  )
}
