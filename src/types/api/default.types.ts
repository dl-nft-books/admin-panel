export type JsonApiRelationship = Record<string, unknown>
export type Uuid = string
export type JsonApiRelationships = Record<
  string,
  JsonApiRelationship | JsonApiRelationship[]
>

export type JsonApiRecordBase<T extends string> = {
  id: Uuid
  type: T
  relationship_names?: JsonApiRelationships
}

export type PageOrder = 'asc' | 'desc'
