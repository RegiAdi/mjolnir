"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"

export default function OrderByNode({ data, isConnectable }: any) {
  const [orders, setOrders] = useState<Array<{ column: string; direction: string }>>(data.orders || [])
  const [newOrder, setNewOrder] = useState({
    column: "",
    direction: "ASC",
  })

  const addOrder = () => {
    if (newOrder.column.trim() !== "") {
      const updatedOrders = [...orders, { ...newOrder }]
      setOrders(updatedOrders)
      data.orders = updatedOrders
      setNewOrder({
        column: "",
        direction: "ASC",
      })
    }
  }

  const removeOrder = (index: number) => {
    const updatedOrders = orders.filter((_, i) => i !== index)
    setOrders(updatedOrders)
    data.orders = updatedOrders
  }

  return (
    <div className="bg-white border-2 border-orange-500 rounded-md p-3 shadow-md w-64">
      <div className="font-bold text-orange-700 mb-2">ORDER BY</div>

      <div className="space-y-3">
        {orders.map((order, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={order.column}
              onChange={(e) => {
                const updatedOrders = [...orders]
                updatedOrders[index].column = e.target.value
                setOrders(updatedOrders)
                data.orders = updatedOrders
              }}
              className="text-sm"
              placeholder="Column"
            />

            <Select
              value={order.direction}
              onValueChange={(value) => {
                const updatedOrders = [...orders]
                updatedOrders[index].direction = value
                setOrders(updatedOrders)
                data.orders = updatedOrders
              }}
            >
              <SelectTrigger className="text-sm w-24">
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">ASC</SelectItem>
                <SelectItem value="DESC">DESC</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" onClick={() => removeOrder(index)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <div className="flex items-center gap-2">
          <Input
            value={newOrder.column}
            onChange={(e) => setNewOrder({ ...newOrder, column: e.target.value })}
            placeholder="Add column"
            className="text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addOrder()
              }
            }}
          />

          <Select value={newOrder.direction} onValueChange={(value) => setNewOrder({ ...newOrder, direction: value })}>
            <SelectTrigger className="text-sm w-24">
              <SelectValue placeholder="Direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ASC">ASC</SelectItem>
              <SelectItem value="DESC">DESC</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" onClick={addOrder} className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        id="in"
        style={{ background: "#f97316", width: "8px", height: "8px" }}
        isConnectable={isConnectable}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        style={{ background: "#f97316", width: "8px", height: "8px" }}
        isConnectable={isConnectable}
      />
    </div>
  )
}
