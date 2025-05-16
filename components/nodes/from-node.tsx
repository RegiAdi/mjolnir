"use client"

import type React from "react"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Input } from "@/components/ui/input"

export default function FromNode({ data, isConnectable }: any) {
  const [tableName, setTableName] = useState<string>(data.tableName || "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTableName(e.target.value)
    data.tableName = e.target.value
  }

  return (
    <div className="bg-white border-2 border-green-500 rounded-md p-3 shadow-md w-64">
      <div className="font-bold text-green-700 mb-2">FROM</div>

      <Input value={tableName} onChange={handleChange} placeholder="Table name" className="text-sm" />

      <Handle
        type="target"
        position={Position.Top}
        id="in"
        style={{ background: "#22c55e", width: "8px", height: "8px" }}
        isConnectable={isConnectable}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        style={{ background: "#22c55e", width: "8px", height: "8px" }}
        isConnectable={isConnectable}
      />
    </div>
  )
}
