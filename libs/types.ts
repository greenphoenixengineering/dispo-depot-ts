export interface Buyer {
  id: number;
  first_name: string;
  email: string;
  phone_num?: string;
  buyer_tags?: {
    tags: {
      id: number;
      name: string;
    };
  }[];
}

export interface NewBuyer {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  groupId: string;
}

export interface NewBuyerInSupa extends NewBuyer {
  api_id: string;
}
