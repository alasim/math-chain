'use client'

import { useState } from 'react'
import ThreadPost from './thread-post'
import { ThreadNode } from '@/type'



interface ThreadViewProps {
  data: ThreadNode
}

export default function ThreadView({ data }: ThreadViewProps) {
  const renderNode = (node: ThreadNode, depth: number = 0) => {

    return (
      <div key={node.id}>
        <ThreadPost
          node={node}
          onReply={() => { }}
          isRoot={depth === 0}
          depth={depth}
        />
        {/* Render child replies recursively */}
        <div>
          {node.children.map((childNode) => renderNode(childNode, depth + 1))}
        </div>
      </div>
    )
  }

  return <div className="bg-card rounded-lg p-8 w-full">{renderNode(data)}</div>
}
