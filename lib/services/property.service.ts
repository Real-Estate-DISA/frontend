import { collection, query, where, getDocs, addDoc, getDoc, doc, updateDoc, deleteDoc, CollectionReference, Query, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export interface LocationFeature {
  name: string
  distance: number
  rating?: number
  vicinity: string
}

export interface LocationFeatures {
  hospitals: LocationFeature[]
  schools: LocationFeature[]
  metro_stations: LocationFeature[]
}

export interface Property {
  id?: string
  title: string
  location: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  type: string
  featured: boolean
  createdAt: Date
  userId: string
  description?: string
  predictedPrice?: number
  locationFeatures?: LocationFeatures
  propertyDetails?: {
    // Common fields
    city: string
    total_weekly_hours: number
    days_open_per_week: number
    has_different_timings: boolean
    weekday_opening_time: string
    weekday_closing_time: string
    
    // Location fields
    nearest_metro_distance: number
    nearest_bus_distance: number
    nearest_train_distance: number
    nearest_airport_distance: number
    nearest_hospital_distance: number
    
    // Coworking specific fields
    total_center_area?: number
    total_seating_capacity?: number
    typical_floorplate_area?: number
    building_type_business_park?: boolean
    building_type_independent_commercial_tower?: boolean
    
    // Office rent specific fields
    floor_size?: number
    lock_in?: number
    floors?: number
    building_grade?: number
    year_built?: number
    furnishing_fully_furnished?: boolean
    furnishing_unfurnished?: boolean
    building_type_business_tower?: boolean
    building_type_it_ites?: boolean
    building_type_independent_commercial_tower_office?: boolean
    
    // Contact information
    contact_number: string
    email: string
    
    // All amenities
    amenities: {
      [key: string]: boolean
    }
    
    // Images
    images: string[]
  }
}

export interface PropertyFilter {
  type?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: string
  bathrooms?: string
  location?: string
  searchTerm?: string
  userId?: string
  // Coworking specific filters
  seating_capacity?: string
  center_area?: string
  weekly_hours?: string
  // Office rent specific filters
  floor_size?: string
  building_grade?: string
  furnishing?: string
}

export const propertyService = {
  async getProperties(filters?: PropertyFilter) {
    try {
      let q: CollectionReference | Query = collection(db, 'properties')
      const constraints = []

      if (filters) {
        // Handle userId filter (for dashboard)
        if (filters.userId) {
          constraints.push(where('userId', '==', filters.userId))
        }

        // Handle type filter
        if (filters.type && filters.type !== 'all') {
          constraints.push(where('type', '==', filters.type))
        }

        // Handle price range
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
          if (filters.minPrice !== undefined) {
            constraints.push(where('price', '>=', filters.minPrice))
          }
          if (filters.maxPrice !== undefined) {
            constraints.push(where('price', '<=', filters.maxPrice))
          }
        }

        // Handle location
        if (filters.location && filters.location !== 'any') {
          constraints.push(where('location', '==', filters.location))
        }
      }

      // Apply the base query with filters
      if (constraints.length > 0) {
        q = query(q, ...constraints)
      }

      const querySnapshot = await getDocs(q)
      let properties = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date() // Convert Firestore Timestamp to Date
      })) as Property[]

      // Apply additional filters in memory
      if (filters) {
        // Filter by bedrooms if specified
        if (filters.bedrooms && filters.bedrooms !== 'any') {
          const bedroomCount = parseInt(filters.bedrooms)
          properties = properties.filter(p => p.bedrooms >= bedroomCount)
        }

        // Filter by bathrooms if specified
        if (filters.bathrooms && filters.bathrooms !== 'any') {
          const bathroomCount = parseInt(filters.bathrooms)
          properties = properties.filter(p => p.bathrooms >= bathroomCount)
        }

        // Handle search term filtering
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase()
          properties = properties.filter(property => 
            property.title.toLowerCase().includes(searchLower) ||
            property.location.toLowerCase().includes(searchLower) ||
            property.description?.toLowerCase().includes(searchLower)
          )
        }
      }

      return properties
    } catch (error) {
      console.error('Error fetching properties:', error)
      throw error
    }
  },

  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const docRef = doc(db, 'properties', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Property
      }
      return null
    } catch (error) {
      console.error('Error getting property:', error)
      throw error
    }
  },

  async createProperty(property: Omit<Property, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'properties'), {
        ...property,
        createdAt: new Date()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating property:', error)
      throw error
    }
  },

  async updateProperty(id: string, propertyData: Partial<Property>) {
    try {
      const propertyRef = doc(db, 'properties', id)
      await updateDoc(propertyRef, {
        ...propertyData,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating property:', error)
      throw error
    }
  },

  async deleteProperty(id: string) {
    try {
      const docRef = doc(db, 'properties', id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting property:', error)
      throw error
    }
  }
} 