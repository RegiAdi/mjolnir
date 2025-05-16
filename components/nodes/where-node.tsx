"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"

export default function WhereNode({ data, isConnectable }: any) {
  const [conditions, setConditions] = useState<Array<{ column: string; operator: string; value: string }>>(
    data.conditions || [],
  )
  const [newCondition, setNewCondition] = useState({
    column: "",
    operator: "=",
    value: "",
  })

  const operators = ["=", "<>", ">", "<", ">=", "<=", "LIKE", "IN", "NOT IN", "IS NULL", "IS NOT NULL"]

  const addCondition = () => {
    if (newCondition.column.trim() !== "") {
      const updatedConditions = [...conditions, { ...newCondition }]
      setConditions(updatedConditions)
      data.conditions = updatedConditions
      setNewCondition({
        column: "",
        operator: "=",
        value: "",
      })
    }
  }

  const removeCondition = (index: number) => {
    const updatedConditions = conditions.filter((_, i) => i !== index)
    setConditions(updatedConditions)
    data.conditions = updatedConditions
  }

  return (
    <div className="bg-white border-2 border-red-500 rounded-md p-3 shadow-md w-64">
      <div className="font-bold text-red-700 mb-2">WHERE</div>

      <div className="space-y-3">
        {conditions.map((condition, index) => (
          <div key={index} className="space-y-2 pb-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Condition {index + 1}</span>
              <Button variant="ghost" size="icon" onClick={() => removeCondition(index)} className="h-6 w-6">
                <X className="h-3 w-3" />
              </Button>
            </div>

            <Input
              value={condition.column}
              onChange={(e) => {
                const updatedConditions = [...conditions]
                updatedConditions[index].column = e.target.value
                setConditions(updatedConditions)
                data.conditions = updatedConditions
              }}
              placeholder="Column"
              className="text-sm"
            />

            <Select
              value={condition.operator}
              onValueChange={(value) => {
                const updatedConditions = [...conditions]
                updatedConditions[index].operator = value
                setConditions(updatedConditions)
                data.conditions = updatedConditions
              }}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                {operators.map((op) => (
                  <SelectItem key={op} value={op}>
                    {op}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {!["IS NULL", "IS NOT NULL"].includes(condition.operator) && (
              <Input
                value={condition.value}
                onChange={(e) => {
                  const updatedConditions = [...conditions]
                  updatedConditions[index].value = e.target.value
                  setConditions(updatedConditions)
                  data.conditions = updatedConditions
                }}
                placeholder="Value"
                className="text-sm"
              />
            )}
          </div>
        ))}

        <div className="space-y-2">
          <div className="text-xs text-gray-500">New condition</div>
          <Input
            value={newCondition.column}
            onChange={(e) => setNewCondition({ ...newCondition, column: e.target.value })}
            placeholder="Column"
            className="text-sm"
          />

          <Select
            value={newCondition.operator}
            onValueChange={(value) => setNewCondition({ ...newCondition, operator: value })}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
              {operators.map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!["IS NULL", "IS NOT NULL"].includes(newCondition.operator) && (
            <Input
              value={newCondition.value}
              onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
              placeholder="Value"
              className="text-sm"
            />
          )}

          <Button variant="outline" size="sm" onClick={addCondition} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Condition
          </Button>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        id="in"
        style={{ background: "#ef4444", width: "8px", height: "8px" }}
        isConnectable={isConnectable}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        style={{ background: "#ef4444", width: "8px", height: "8px" }}
        isConnectable={isConnectable}
      />
    </div>
  )
}
