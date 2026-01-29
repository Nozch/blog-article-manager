export type Article = {
  id: string
  publishStatus: 'draft' | 'public' | 'deleted'
  title: string
  lead?: string
}

export type Filter = 'all' | Article['publishStatus'];

export type State = {
  activeFilter: Filter,
  selectedIds: ReadonlySet<String>
};

