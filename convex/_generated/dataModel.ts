// Mock implementation of Convex data model for development/preview

export type Id<TableName extends string> = string & { __id: TableName }

