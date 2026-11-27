export interface DeliveryAddress {
  id: string
  name: string
  tag: 'Home' | 'Work' | 'Other' | string
  addressLine: string
  phone: string
  isDefault?: boolean
  house_details?: string
  street_area?: string
  city?: string
  state?: string
  pincode?: string
}

export const initialAddresses: DeliveryAddress[] = []
