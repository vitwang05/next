// types/customer.ts
export type Billing = {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  email?: string;
  phone?: string;
};

export type Shipping = {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
};

export type Customer = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  databaseId: number;
  billing?: Billing | null;   // null cũng hợp lệ
  shipping?: Shipping | null; // null cũng hợp lệ
};

export type GetCustomerResponse = {
  customer: Customer | null;
};
