"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Bath, Bed, Calendar, Heart, MapPin, Maximize, Pencil, Trash2, Hospital, School, Train, Users, Building2, Clock, Wifi, Coffee, Printer, Car, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Property, propertyService } from "@/lib/services/property.service"
import Navigation from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function PropertyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        setError(null)
        const propertyId = params.id as string
        const data = await propertyService.getPropertyById(propertyId)
        setProperty(data)
      } catch (err) {
        setError("Failed to fetch property details. Please try again later.")
        console.error("Error fetching property:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [params.id])

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  // Helper function to get amenity icon
  const getAmenityIcon = (amenityKey: string) => {
    switch (amenityKey) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />
      case 'coffee':
        return <Coffee className="h-4 w-4" />
      case 'printer':
        return <Printer className="h-4 w-4" />
      case '2_wheeler_parking':
      case '4_wheeler_parking':
        return <Car className="h-4 w-4" />
      case 'phone_booth':
        return <Phone className="h-4 w-4" />
      default:
        return <Building2 className="h-4 w-4" />
    }
  }

  // Helper function to format amenity names
  const formatAmenityName = (amenityKey: string) => {
    return amenityKey
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace('2 Wheeler', '2-Wheeler')
      .replace('4 Wheeler', '4-Wheeler')
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container px-4 py-8 md:px-6">
          <div className="text-center">Loading property details...</div>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container px-4 py-8 md:px-6">
          <div className="text-center text-red-500">{error || "Property not found"}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container px-4 py-8 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="relative">
            <img
              src={property.image || "/placeholder.svg"}
              alt={property.title}
              className="w-full aspect-[4/3] rounded-lg object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 rounded-full"
              onClick={toggleFavorite}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              <span className="sr-only">Add to favorites</span>
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <div className="flex items-center mt-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.location}</span>
              </div>
              <Badge className="mt-2" variant="secondary">
                {property.type.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            {/* Property Type Specific Information */}
            {property.type && (property.type.includes('coworking') || property.type === 'dedicated_desk' || property.type === 'private_cabin' || property.type === 'managed_office') ? (
              <div className="flex items-center gap-4 text-lg">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{property.propertyDetails?.total_seating_capacity || 'N/A'} Seats</span>
                </div>
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  <span>{property.propertyDetails?.total_center_area?.toLocaleString() || property.area.toLocaleString()} sqft</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{property.propertyDetails?.total_weekly_hours || 'N/A'} hrs/week</span>
                </div>
              </div>
            ) : property.type === 'office_rent' ? (
              <div className="flex items-center gap-4 text-lg">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  <span>{property.propertyDetails?.floor_size?.toLocaleString() || property.area.toLocaleString()} sqft</span>
                </div>
                <div className="flex items-center">
                  <Maximize className="h-5 w-5 mr-2" />
                  <span>{property.propertyDetails?.floors || 'N/A'} Floors</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{property.propertyDetails?.lock_in || 'N/A'} months lock-in</span>
                </div>
              </div>
            ) : (
              // Fallback for other property types
              <div className="flex items-center gap-4 text-lg">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2" />
                  <span>{property.bedrooms} Beds</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2" />
                  <span>{property.bathrooms} Baths</span>
                </div>
                <div className="flex items-center">
                  <Maximize className="h-5 w-5 mr-2" />
                  <span>{property.area} sqft</span>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold">₹{property.price.toLocaleString()}/month</h2>
              {property.predictedPrice && (
                <p className="text-muted-foreground">
                  AI Predicted Price: ₹{property.predictedPrice.toLocaleString()}/month
                </p>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{property.description || "No description available."}</p>
            </div>

            {/* Property Details Section */}
            {property.propertyDetails && (
              <div className="space-y-4">
                <h3 className="font-medium">Property Details</h3>
                
                {/* Operating Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-sm font-medium">Operating Hours</p>
                    <p className="text-sm text-muted-foreground">
                      {property.propertyDetails.weekday_opening_time} - {property.propertyDetails.weekday_closing_time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {property.propertyDetails.days_open_per_week} days per week
                    </p>
                  </div>
                  
                  {/* Contact Information */}
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-sm font-medium">Contact Information</p>
                    <p className="text-sm text-muted-foreground">{property.propertyDetails.contact_number}</p>
                    <p className="text-sm text-muted-foreground">{property.propertyDetails.email}</p>
                  </div>
                </div>

                {/* Location Distances */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <div className="bg-muted/50 p-2 rounded-md text-center">
                    <p className="text-xs font-medium">Metro</p>
                    <p className="text-xs text-muted-foreground">{property.propertyDetails.nearest_metro_distance}m</p>
                  </div>
                  <div className="bg-muted/50 p-2 rounded-md text-center">
                    <p className="text-xs font-medium">Bus</p>
                    <p className="text-xs text-muted-foreground">{property.propertyDetails.nearest_bus_distance}m</p>
                  </div>
                  <div className="bg-muted/50 p-2 rounded-md text-center">
                    <p className="text-xs font-medium">Train</p>
                    <p className="text-xs text-muted-foreground">{property.propertyDetails.nearest_train_distance}m</p>
                  </div>
                  <div className="bg-muted/50 p-2 rounded-md text-center">
                    <p className="text-xs font-medium">Airport</p>
                    <p className="text-xs text-muted-foreground">{property.propertyDetails.nearest_airport_distance}m</p>
                  </div>
                  <div className="bg-muted/50 p-2 rounded-md text-center">
                    <p className="text-xs font-medium">Hospital</p>
                    <p className="text-xs text-muted-foreground">{property.propertyDetails.nearest_hospital_distance}m</p>
                  </div>
                </div>
              </div>
            )}

            {/* Amenities Section */}
            {property.propertyDetails?.amenities && (
              <div className="space-y-4">
                <h3 className="font-medium">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(property.propertyDetails.amenities)
                    .filter(([_, value]) => value)
                    .map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                        {getAmenityIcon(key)}
                        <span className="text-sm">{formatAmenityName(key)}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Listed on {new Date(property.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex gap-4">
              {user?.uid === property.userId ? (
                <>
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    size="lg"
                    onClick={() => router.push(`/properties/${property.id}/edit`)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Property
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1" 
                    size="lg"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this property?')) {
                        try {
                          await propertyService.deleteProperty(property.id!)
                          router.push('/dashboard')
                        } catch (error) {
                          console.error('Error deleting property:', error)
                        }
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Property
                  </Button>
                </>
              ) : (
                <>
                  <Button className="flex-1" size="lg">
                    Contact Seller
                  </Button>
                  <Button variant="outline" className="flex-1" size="lg">
                    Schedule Viewing
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

