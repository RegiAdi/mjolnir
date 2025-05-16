import type { Edge, Node } from "reactflow"

// Helper function to escape SQL values
const escapeValue = (value: string): string => {
  // If the value is a number, don't add quotes
  if (!isNaN(Number(value)) && value.trim() !== "") {
    return value
  }

  // If it looks like a function or subquery, don't add quotes
  if (value.includes("(") && value.includes(")")) {
    return value
  }

  // Otherwise, add quotes
  return `'${value.replace(/'/g, "''")}'`
}

// Main function to generate SQL from nodes and edges
export const generateSqlQuery = (nodes: Node[], edges: Edge[]): string => {
  // Create a map of node connections
  const connections: Record<string, string[]> = {}

  edges.forEach((edge) => {
    if (!connections[edge.source]) {
      connections[edge.source] = []
    }
    connections[edge.source].push(edge.target)
  })

  // Find the starting node (usually SELECT)
  const startNode = nodes.find((node) => node.type === "selectNode")

  if (!startNode) {
    return "-- Add a SELECT node to start building your query"
  }

  // Build the query by traversing the nodes
  let query = ""
  let currentNodeId = startNode.id
  const visitedNodes: Record<string, boolean> = {}

  // Process nodes in order based on connections
  while (currentNodeId) {
    const currentNode = nodes.find((node) => node.id === currentNodeId)

    if (!currentNode || visitedNodes[currentNodeId]) {
      break
    }

    visitedNodes[currentNodeId] = true

    // Process node based on type
    switch (currentNode.type) {
      case "selectNode":
        const selectFields = currentNode.data.fields || ["*"]
        query += `SELECT ${selectFields.join(", ")}`
        break

      case "fromNode":
        const tableName = currentNode.data.tableName || ""
        if (tableName) {
          query += `\nFROM ${tableName}`
        } else {
          query += "\nFROM table_name"
        }
        break

      case "joinNode":
        const joinType = currentNode.data.joinType || "INNER JOIN"
        const joinTable = currentNode.data.tableName || ""
        const joinCondition = currentNode.data.onCondition || ""

        if (joinTable) {
          query += `\n${joinType} ${joinTable}`
          if (joinCondition) {
            query += ` ON ${joinCondition}`
          } else {
            query += ` ON condition`
          }
        }
        break

      case "whereNode":
        const conditions = currentNode.data.conditions || []

        if (conditions.length > 0) {
          query += "\nWHERE "

          conditions.forEach((condition: any, index: number) => {
            if (index > 0) {
              query += " AND "
            }

            const { column, operator, value } = condition

            if (["IS NULL", "IS NOT NULL"].includes(operator)) {
              query += `${column} ${operator}`
            } else {
              query += `${column} ${operator} ${escapeValue(value)}`
            }
          })
        }
        break

      case "groupByNode":
        const groupColumns = currentNode.data.columns || []

        if (groupColumns.length > 0) {
          query += `\nGROUP BY ${groupColumns.join(", ")}`
        }
        break

      case "orderByNode":
        const orders = currentNode.data.orders || []

        if (orders.length > 0) {
          query += "\nORDER BY "

          orders.forEach((order: any, index: number) => {
            if (index > 0) {
              query += ", "
            }

            const { column, direction } = order
            query += `${column} ${direction}`
          })
        }
        break

      case "limitNode":
        const limit = currentNode.data.limit || ""
        const offset = currentNode.data.offset || ""

        if (limit) {
          query += `\nLIMIT ${limit}`

          if (offset) {
            query += ` OFFSET ${offset}`
          }
        }
        break
    }

    // Find the next node to process
    const nextNodes = connections[currentNodeId] || []
    currentNodeId = nextNodes[0] || ""
  }

  return query
}
