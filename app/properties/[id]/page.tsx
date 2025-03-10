"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Bath, Bed, Calendar, Heart, MapPin, Maximize } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Property, propertyService } from "@/lib/services/property.service"
import Navigation from "@/components/navigation"

export default function PropertyDetailsPage() {
  const params = useParams()
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
            </div>

            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{property.description || "No description available."}</p>
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Listed on {new Date(property.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1" size="lg">
                Contact Seller
              </Button>
              <Button variant="outline" className="flex-1" size="lg">
                Schedule Viewing
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

