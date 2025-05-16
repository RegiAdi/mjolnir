"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"

export default function GroupByNode({ data, isConnectable }: any) {
  const [columns, setColumns] = useState<string[]>(data.columns || [])
  const [newColumn, setNewColumn] = useState("")

  const addColumn = () => {
    if (newColumn.trim() !== "") {
      const updatedColumns = [...columns, newColumn.trim()]
      setColumns(updatedColumns)
      data.columns = updatedColumns
      setNewColumn("")
    }
  }

  const removeColumn = (index: number) => {
    const updatedColumns = columns.filter((_, i) => i !== index)
    setColumns(updatedColumns)
    data.columns = updatedColumns
  }

  return (
    <div className="bg-white border-2 border-purple-500 rounded-md p-3 shadow-md w-64">
      <div className="font-bold text-purple-700 mb-2">GROUP BY</div>

      <div className="space-y-2">
        {columns.map((column, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={column}
              onChange={(e) => {
                const updatedColumns = [...columns]
                updatedColumns[index] = e.target.value
                setColumns(updatedColumns)
                data.columns = updatedColumns
              }}
              className="text-sm"
            />
            <Button variant="ghost" size="icon" onClick={() => removeColumn(index)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <div className="flex items-center gap-2">
          <Input
            value={newColumn}
            onChange={(e) => setNewColumn(e.target.value)}
            placeholder="Add column"
            className="text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addColumn()
              }
            }}
          />
          <Button variant="ghost" size="icon" onClick={addColumn} className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        id="in"
        style={{ background: "#a855f7", width: "8px", height: "8px" }}
        isConnectable={isConnectable}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        style={{ background: "#a855f7", width: "8px", height: "8px" }}
        isConnectable={isConnectable}
      />
    </div>
  )
}
