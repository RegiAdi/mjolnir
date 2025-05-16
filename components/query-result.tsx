"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CopyIcon, CheckIcon } from "lucide-react"

interface QueryResultProps {
  query: string
}

export default function QueryResult({ query }: QueryResultProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(query)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <Card className="relative bg-slate-950 p-4 rounded-md overflow-auto max-h-[500px]">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
          onClick={copyToClipboard}
        >
          {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
        </Button>
        <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
          {query || "-- Your SQL query will appear here --"}
        </pre>
      </Card>
    </div>
  )
}
