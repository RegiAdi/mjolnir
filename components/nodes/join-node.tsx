"use client"

import type React from "react"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function JoinNode({ data, isConnectable }: any) {
  const [joinType, setJoinType] = useState<string>(data.joinType || "INNER JOIN")
  const [tableName, setTableName] = useState<string>(data.tableName || "")
  const [onCondition, setOnCondition] = useState<string>(data.onCondition || "")

  const joinTypes = ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"]

  const handleJoinTypeChange = (value: string) => {
    setJoinType(value)
    data.joinType = value
  }

  const handleTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTableName(e.target.value)
    data.tableName = e.target.value
  }

  const handleOnConditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOnCondition(e.target.value)
    data.onCondition = e.target.value
  }

  return (
    <div className="bg-white border-2 border-yellow-500 rounded-md p-3 shadow-md w-64">
      <div className="font-bold text-yellow-700 mb-2">JOIN</div>

      <div className="space-y-2">
        <Select value={joinType} onValueChange={handleJoinTypeChange}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Join Type" />
          </SelectTrigger>
          <SelectContent>
            {joinTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input value={tableName} onChange={handleTableNameChange} placeholder="Table name" className="text-sm" />

        <div className="text-xs text-gray-500 mt-2">ON condition</div>
        <Input
          value={onCondition}
          onChange={handleOnConditionChange}
          placeholder="e.g. table1.id = table2.id"
          className="text-sm"
        />
      </div>

      <Handle
        type="target"
        position={Position.Top}
        id="in"
        style={{ background: "#eab308", width: "8px", height: "8px" }}
        isConnectable={isConnectable}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        style={{ background: "#eab308", width: "8px", height: "8px" }}
        isConnectable={isConnectable}
      />
    </div>
  )
}
