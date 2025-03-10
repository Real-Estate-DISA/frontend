// User model
export interface User {
  id: string
  email: string
  name?: string
  photoURL?: string
  phone?: string
  role: "buyer" | "seller" | "both"
  createdAt: Date
  updatedAt: Date
}

// Property model
export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: {
    address: string
    city: string
    state: string
    zip: string
    country: string
  }
  features: {
    bedrooms: number
    bathrooms: number
    area: number
    yearBuilt?: number
    propertyType: string
  }
  amenities: string[]
  images: string[]
  sellerId: string
  featured: boolean
  status: "active" | "pending" | "sold"
  createdAt: Date
  updatedAt: Date
}

// Message model
export interface Message {
  id: string
  senderId: string
  receiverId: string
  propertyId?: string
  content: string
  read: boolean
  createdAt: Date
}

// Favorite model
export interface Favorite {
  id: string
  userId: string
  propertyId: string
  createdAt: Date
}

