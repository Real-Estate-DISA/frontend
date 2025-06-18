"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Bath, Bed, Calendar, Heart, MapPin, Maximize, Pencil, Trash2, Hospital, School, Train } from "lucide-react"

import { Button } from "@/components/ui/button"
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
            </div>

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

            <div>
              <h2 className="text-2xl font-bold">${property.price.toLocaleString()}</h2>
              {property.predictedPrice && (
                <p className="text-muted-foreground">
                  Predicted Price: ${property.predictedPrice.toLocaleString()}
                </p>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{property.description || "No description available."}</p>
            </div>

            {property.locationFeatures && (
              <div className="space-y-4">
                <h3 className="font-medium">Nearby Amenities</h3>
                
                {property.locationFeatures.hospitals.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Hospital className="h-5 w-5 text-muted-foreground" />
                      <h4 className="font-medium">Hospitals</h4>
                    </div>
                    <div className="grid gap-2">
                      {property.locationFeatures.hospitals.map((hospital, index) => (
                        <div key={index} className="text-sm bg-muted/50 p-2 rounded-md">
                          <p className="font-medium">{hospital.name}</p>
                          <p className="text-muted-foreground">{hospital.vicinity}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span>{hospital.distance}m away</span>
                            {hospital.rating && (
                              <span className="text-yellow-500">★ {hospital.rating}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {property.locationFeatures.schools.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <School className="h-5 w-5 text-muted-foreground" />
                      <h4 className="font-medium">Schools</h4>
                    </div>
                    <div className="grid gap-2">
                      {property.locationFeatures.schools.map((school, index) => (
                        <div key={index} className="text-sm bg-muted/50 p-2 rounded-md">
                          <p className="font-medium">{school.name}</p>
                          <p className="text-muted-foreground">{school.vicinity}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span>{school.distance}m away</span>
                            {school.rating && (
                              <span className="text-yellow-500">★ {school.rating}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {property.locationFeatures.metro_stations.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Train className="h-5 w-5 text-muted-foreground" />
                      <h4 className="font-medium">Metro Stations</h4>
                    </div>
                    <div className="grid gap-2">
                      {property.locationFeatures.metro_stations.map((station, index) => (
                        <div key={index} className="text-sm bg-muted/50 p-2 rounded-md">
                          <p className="font-medium">{station.name}</p>
                          <p className="text-muted-foreground">{station.vicinity}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span>{station.distance}m away</span>
                            {station.rating && (
                              <span className="text-yellow-500">★ {station.rating}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

