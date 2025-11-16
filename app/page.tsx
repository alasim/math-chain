
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/header'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CreateThreadForm } from '@/components/forms/create-thread-form'
import { fetchAllRootTreesWithCount } from '@/actions/tree'
import { getCurrentUser } from '@/lib/auth'


export default async function HomePage() {
  const rootTrees = await fetchAllRootTreesWithCount()
  const user = await getCurrentUser()
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">All Math Chains</h1>
            <p className="text-muted-foreground text-lg">
              Explore mathematical chains in an expanding thread structure
            </p>
          </div>
          {user && <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                New Chain
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className='p-0'>
              <Card className="w-full max-w-md border-none shadow-none">
                <CardHeader>
                  <CardTitle>Create New Chain</CardTitle>
                  <CardDescription>
                    Start a new chain with a starting number
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CreateThreadForm />
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {rootTrees.map((tree) => (
            <Card
              key={tree.id}
              className="p-6 border border-border/10 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-primary">{tree.rootValue}</span>
                  <span className="text-sm text-muted-foreground">Starting Number</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Author</span>
                  <span className="text-foreground font-medium capitalize">{tree.authorName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Nodes</span>
                  <span className="text-foreground font-medium">{tree.nodeCount}</span>
                </div>
              </div>

              <Link href={`/chain/${tree.id}`}>
                <Button
                  variant="outline"
                  className='w-full'
                >
                  Open Chain Details
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
