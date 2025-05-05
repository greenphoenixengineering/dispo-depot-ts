export interface Buyer {
  id: number;
  first_name: string
  email: string;
  phone_num?: string;
  buyer_tags?: {
    tags: {
      id: number;
      name: string;
    };
  }[];
}

export interface buyerFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_num: string;
}

export interface NewBuyer extends buyerFormData {
  groupId: string;
}

export interface NewBuyerInSupa extends NewBuyer {
  api_id: string;
}


 
// const payload = {
//   buyerId: buyer.id,
//   updates: formData,
//   tags: tagsPayload,
//   buyerApiId: buyer.api_id,
// };

export interface UpdateBuyer {
  buyerId:string
  updates: buyerFormData
  tags:any
  buyerApiId:string
}
