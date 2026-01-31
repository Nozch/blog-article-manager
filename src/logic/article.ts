import type { Article } from "../data/loadArticles";

export type Filter = 'all' | Article['publishStatus'];

export type State = {
  activeFilter: Filter,
  selectedIds: ReadonlySet<String>
};

