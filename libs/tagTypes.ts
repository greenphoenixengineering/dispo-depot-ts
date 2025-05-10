export interface TagWithBuyerCount {
  id: number;
  name: string;
  api_id: string;
  buyer_count: number;
}

export interface NewTag {
  name: string;
}

export interface DeletedTag {
  tagId: number;
  tagApiId: string;
}
