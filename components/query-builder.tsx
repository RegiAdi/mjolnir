"use client"

import type React from "react"

import { useCallback, useRef, useState } from "react"
import ReactFlow, {
  addEdge,
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type NodeTypes,
  Panel,
  useEdgesState,
  useNodesState,
} from "reactflow"
import "reactflow/dist/style.css"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SelectNode from "./nodes/select-node"
import FromNode from "./nodes/from-node"
import WhereNode from "./nodes/where-node"
import JoinNode from "./nodes/join-node"
import GroupByNode from "./nodes/group-by-node"
import OrderByNode from "./nodes/order-by-node"
import LimitNode from "./nodes/limit-node"
import { generateSqlQuery } from "@/lib/sql-generator"

// Define custom node types
const nodeTypes: NodeTypes = {
  selectNode: SelectNode,
  fromNode: FromNode,
  whereNode: WhereNode,
  joinNode: JoinNode,
  groupByNode: GroupByNode,
  orderByNode: OrderByNode,
  limitNode: LimitNode,
}

interface QueryBuilderProps {
  onQueryChange: (query: string) => void
}

export default function QueryBuilder({ onQueryChange }: QueryBuilderProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(params, edges)
      setEdges(newEdges)

      // Generate SQL after connection
      setTimeout(() => {
        const sql = generateSqlQuery(nodes, newEdges)
        onQueryChange(sql)
      }, 100)
    },
    [edges, nodes, onQueryChange, setEdges],
  )

  // Update SQL when nodes change
  const handleNodesChange = (changes: NodeChange[]) => {
    onNodesChange(changes)

    // Generate SQL after node change
    setTimeout(() => {
      const sql = generateSqlQuery(nodes, edges)
      onQueryChange(sql)
    }, 100)
  }

  // Update SQL when edges change
  const handleEdgesChange = (changes: EdgeChange[]) => {
    onEdgesChange(changes)

    // Generate SQL after edge change
    setTimeout(() => {
      const sql = generateSqlQuery(nodes, edges)
      onQueryChange(sql)
    }, 100)
  }

  // Handle drag and drop from sidebar
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      if (!reactFlowWrapper.current || !reactFlowInstance) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData("application/reactflow")

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      // Create a new node
      const newNode: Node = {
        id: `${type}-${nodes.length + 1}`,
        type,
        position,
        data: { label: type, fields: [] },
      }

      setNodes((nds) => nds.concat(newNode))

      // Generate SQL after adding node
      setTimeout(() => {
        const sql = generateSqlQuery([...nodes, newNode], edges)
        onQueryChange(sql)
      }, 100)
    },
    [reactFlowInstance, nodes, edges, setNodes, onQueryChange],
  )

  // Handle drag start for sidebar items
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="h-full flex" ref={reactFlowWrapper}>
      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background gap={12} size={1} />

          <Panel position="top-left" className="bg-background border rounded-md p-2 shadow-sm">
            <Tabs defaultValue="clauses">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="clauses">SQL Clauses</TabsTrigger>
                <TabsTrigger value="functions">Functions</TabsTrigger>
              </TabsList>
              <TabsContent value="clauses" className="space-y-2 mt-2">
                <div
                  className="bg-blue-100 p-2 rounded cursor-move border border-blue-300 text-sm"
                  onDragStart={(e) => onDragStart(e, "selectNode")}
                  draggable
                >
                  SELECT
                </div>
                <div
                  className="bg-green-100 p-2 rounded cursor-move border border-green-300 text-sm"
                  onDragStart={(e) => onDragStart(e, "fromNode")}
                  draggable
                >
                  FROM
                </div>
                <div
                  className="bg-yellow-100 p-2 rounded cursor-move border border-yellow-300 text-sm"
                  onDragStart={(e) => onDragStart(e, "joinNode")}
                  draggable
                >
                  JOIN
                </div>
                <div
                  className="bg-red-100 p-2 rounded cursor-move border border-red-300 text-sm"
                  onDragStart={(e) => onDragStart(e, "whereNode")}
                  draggable
                >
                  WHERE
                </div>
                <div
                  className="bg-purple-100 p-2 rounded cursor-move border border-purple-300 text-sm"
                  onDragStart={(e) => onDragStart(e, "groupByNode")}
                  draggable
                >
                  GROUP BY
                </div>
                <div
                  className="bg-orange-100 p-2 rounded cursor-move border border-orange-300 text-sm"
                  onDragStart={(e) => onDragStart(e, "orderByNode")}
                  draggable
                >
                  ORDER BY
                </div>
                <div
                  className="bg-gray-100 p-2 rounded cursor-move border border-gray-300 text-sm"
                  onDragStart={(e) => onDragStart(e, "limitNode")}
                  draggable
                >
                  LIMIT
                </div>
              </TabsContent>
              <TabsContent value="functions" className="space-y-2 mt-2">
                <div className="text-sm text-muted-foreground">Coming soon...</div>
              </TabsContent>
            </Tabs>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  )
}
