"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"

export default function SelectNode({ data, isConnectable }: any) {
  const [fields, setFields] = useState<string[]>(data.fields || ["*"])
  const [newField, setNewField] = useState("")

  const addField = () => {
    if (newField.trim() !== "") {
      const updatedFields = [...fields, newField.trim()]
      setFields(updatedFields)
      data.fields = updatedFields
      setNewField("")
    }
  }

  const removeField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index)
    setFields(updatedFields)
    data.fields = updatedFields
  }

  return (
    <div className="bg-white border-2 border-blue-500 rounded-md p-3 shadow-md w-64">
      <div className="font-bold text-blue-700 mb-2">SELECT</div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={field}
              onChange={(e) => {
                const updatedFields = [...fields]
                updatedFields[index] = e.target.value
                setFields(updatedFields)
                data.fields = updatedFields
              }}
              className="text-sm"
            />
            <Button variant="ghost" size="icon" onClick={() => removeField(index)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <div className="flex items-center gap-2">
          <Input
            value={newField}
            onChange={(e) => setNewField(e.target.value)}
            placeholder="Add column"
            className="text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addField()
              }
            }}
          />
          <Button variant="ghost" size="icon" onClick={addField} className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        style={{ background: "#3b82f6", width: "8px", height: "8px" }}
        isConnectable={isConnectable}
      />
    </div>
  )
}
