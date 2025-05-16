"use client"

import { useState } from "react"
import QueryBuilder from "@/components/query-builder"
import QueryResult from "@/components/query-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const [generatedQuery, setGeneratedQuery] = useState<string>("")

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Visual SQL Query Builder</h1>
        <p className="text-muted-foreground">Build SQL queries visually using a flow diagram</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Query Designer</CardTitle>
            <CardDescription>Drag nodes from the sidebar and connect them to build your query</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] border rounded-md">
              <QueryBuilder onQueryChange={setGeneratedQuery} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated SQL</CardTitle>
            <CardDescription>The SQL query generated from your diagram</CardDescription>
          </CardHeader>
          <CardContent>
            <QueryResult query={generatedQuery} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
