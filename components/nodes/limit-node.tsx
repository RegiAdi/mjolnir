"use client"

import type React from "react"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Input } from "@/components/ui/input"

export default function LimitNode({ data, isConnectable }: any) {
  const [limit, setLimit] = useState<string>(data.limit || "")
  const [offset, setOffset] = useState<string>(data.offset || "")

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(e.target.value)
    data.limit = e.target.value
  }

  const handleOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOffset(e.target.value)
    data.offset = e.target.value
  }

  return (
    <div className="bg-white border-2 border-gray-500 rounded-md p-3 shadow-md w-64">
      <div className="font-bold text-gray-700 mb-2">LIMIT / OFFSET</div>

      <div className="space-y-2">
        <div className="text-xs text-gray-500">Limit</div>
        <Input
          value={limit}
          onChange={handleLimitChange}
          placeholder="Number of rows"
          className="text-sm"
          type="number"
          min="1"
        />

        <div className="text-xs text-gray-500 mt-2">Offset</div>
        <Input
          value={offset}
          onChange={handleOffsetChange}
          placeholder="Skip rows (optional)"
          className="text-sm"
          type="number"
          min="0"
        />
      </div>

      <Handle
        type="target"
        position={Position.Top}
        id="in"
        style={{ background: "#6b7280", width: "8px", height: "8px" }}
        isConnectable={isConnectable}
      />
    </div>
  )
}
