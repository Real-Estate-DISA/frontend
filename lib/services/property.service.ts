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
      console.log('🔍 Fetching properties with filters:', filters)
      
      let q: CollectionReference | Query = collection(db, 'properties')
      const constraints = []

      if (filters) {
        // Handle userId filter (for dashboard)
        if (filters.userId) {
          constraints.push(where('userId', '==', filters.userId))
        }

        // Handle location filter
        if (filters.location && filters.location !== 'any') {
          // Check if we should filter by location field or propertyDetails.city
          console.log('🔍 Location filter requested:', filters.location)
          // We'll apply location filter in memory since it might be in propertyDetails.city
        }
      }

      // Apply the base query with filters
      if (constraints.length > 0) {
        q = query(q, ...constraints)
        console.log('🔧 Applied constraints:', constraints.length)
      } else {
        console.log('📋 No constraints applied, fetching all properties')
      }

      const querySnapshot = await getDocs(q)
      console.log('📊 Raw query result count:', querySnapshot.docs.length)
      
      let properties = querySnapshot.docs.map(doc => {
        const data = doc.data()
        console.log('📄 Raw document data for ID', doc.id, ':', data)
        
        const mappedProperty = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date() // Convert Firestore Timestamp to Date
        }
        
        console.log('🔄 Mapped property:', mappedProperty)
        return mappedProperty
      }) as Property[]

      console.log('🔄 Properties after mapping:', properties.length)
      console.log('📝 Sample property:', properties[0] ? {
        id: properties[0].id,
        title: properties[0].title,
        type: properties[0].type,
        price: properties[0].price,
        location: properties[0].location,
        propertyDetails: properties[0].propertyDetails ? {
          city: properties[0].propertyDetails.city,
          total_seating_capacity: properties[0].propertyDetails.total_seating_capacity,
          total_center_area: properties[0].propertyDetails.total_center_area,
          total_weekly_hours: properties[0].propertyDetails.total_weekly_hours,
          floor_size: properties[0].propertyDetails.floor_size,
          building_grade: properties[0].propertyDetails.building_grade,
          furnishing_fully_furnished: properties[0].propertyDetails.furnishing_fully_furnished,
          furnishing_unfurnished: properties[0].propertyDetails.furnishing_unfurnished
        } : 'No propertyDetails'
      } : 'No properties found')

      // Apply additional filters in memory
      if (filters) {
        console.log('🔍 Applying filters in memory:', {
          type: filters.type,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          location: filters.location,
          searchTerm: filters.searchTerm,
          seating_capacity: filters.seating_capacity,
          center_area: filters.center_area,
          weekly_hours: filters.weekly_hours,
          floor_size: filters.floor_size,
          building_grade: filters.building_grade,
          furnishing: filters.furnishing
        })
        
        // Apply type filter in memory
        if (filters.type && filters.type !== 'all') {
          const beforeCount = properties.length
          properties = properties.filter(p => p.type === filters.type)
          console.log(`🎯 Type filter in memory: ${beforeCount} → ${properties.length} properties (type: ${filters.type})`)
        }

        // Handle price range filtering in memory
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
          const beforeCount = properties.length
          if (filters.minPrice !== undefined) {
            properties = properties.filter(p => p.price >= filters.minPrice!)
          }
          if (filters.maxPrice !== undefined) {
            properties = properties.filter(p => p.price <= filters.maxPrice!)
          }
          console.log(`💰 Price filter in memory: ${beforeCount} → ${properties.length} properties`)
        }

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

        // Handle location filtering in memory
        if (filters.location && filters.location !== 'any') {
          const beforeCount = properties.length
          properties = properties.filter(property => {
            // Check both location field and propertyDetails.city
            const locationMatch = property.location?.toLowerCase() === filters.location?.toLowerCase()
            const cityMatch = property.propertyDetails?.city?.toLowerCase() === filters.location?.toLowerCase()
            return locationMatch || cityMatch
          })
          console.log(`📍 Location filter in memory: ${beforeCount} → ${properties.length} properties (filter: ${filters.location})`)
        }

        // Handle coworking specific filters
        if (filters.seating_capacity && filters.seating_capacity !== 'any') {
          const capacity = parseInt(filters.seating_capacity)
          const beforeCount = properties.length
          properties = properties.filter(property => 
            property.propertyDetails?.total_seating_capacity && 
            property.propertyDetails.total_seating_capacity >= capacity
          )
          console.log(`👥 Seating capacity filter: ${beforeCount} → ${properties.length} properties (min: ${capacity})`)
        }

        if (filters.center_area && filters.center_area !== 'any') {
          const area = parseInt(filters.center_area)
          const beforeCount = properties.length
          properties = properties.filter(property => 
            property.propertyDetails?.total_center_area && 
            property.propertyDetails.total_center_area >= area
          )
          console.log(`🏢 Center area filter: ${beforeCount} → ${properties.length} properties (min: ${area})`)
        }

        if (filters.weekly_hours && filters.weekly_hours !== 'any') {
          const hours = parseInt(filters.weekly_hours)
          const beforeCount = properties.length
          properties = properties.filter(property => 
            property.propertyDetails?.total_weekly_hours && 
            property.propertyDetails.total_weekly_hours >= hours
          )
          console.log(`⏰ Weekly hours filter: ${beforeCount} → ${properties.length} properties (min: ${hours})`)
        }

        // Handle office rent specific filters
        if (filters.floor_size && filters.floor_size !== 'any') {
          const size = parseInt(filters.floor_size)
          const beforeCount = properties.length
          properties = properties.filter(property => 
            property.propertyDetails?.floor_size && 
            property.propertyDetails.floor_size >= size
          )
          console.log(`📏 Floor size filter: ${beforeCount} → ${properties.length} properties (min: ${size})`)
        }

        if (filters.building_grade && filters.building_grade !== 'any') {
          const grade = parseInt(filters.building_grade)
          const beforeCount = properties.length
          properties = properties.filter(property => 
            property.propertyDetails?.building_grade && 
            property.propertyDetails.building_grade === grade
          )
          console.log(`🏗️ Building grade filter: ${beforeCount} → ${properties.length} properties (grade: ${grade})`)
        }

        if (filters.furnishing && filters.furnishing !== 'any') {
          const beforeCount = properties.length
          properties = properties.filter(property => {
            if (filters.furnishing === 'furnished') {
              return property.propertyDetails?.furnishing_fully_furnished === true
            } else if (filters.furnishing === 'unfurnished') {
              return property.propertyDetails?.furnishing_unfurnished === true
            }
            return true
          })
          console.log(`🪑 Furnishing filter: ${beforeCount} → ${properties.length} properties (type: ${filters.furnishing})`)
        }
      }

      console.log('✅ Final properties count:', properties.length)
      return properties
    } catch (error) {
      console.error('❌ Error fetching properties:', error)
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