export type Article = {
  id: string
  visibility: Visibility
  title: string
  lead?: string
}

export type Visibility = 'draft' | 'public' | 'deleted';

export type Filter = 'all' | Visibility;

export type State = {
  activeFilter: Filter;
};

