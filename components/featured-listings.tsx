"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bath, Bed, MapPin, Maximize } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Property, propertyService } from "@/lib/services/property.service"

export default function FeaturedListings() {
  const [listings, setListings] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true)
        setError(null)
        const properties = await propertyService.getProperties()
        // Filter featured properties and limit to 4
        const featuredProperties = properties
          .filter(property => property.featured)
          .slice(0, 4)
        setListings(featuredProperties)
      } catch (err) {
        setError("Failed to fetch featured properties")
        console.error("Error fetching featured properties:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProperties()
  }, [])

  if (loading) {
    return (
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="text-center">Loading featured properties...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    )
  }

  if (listings.length === 0) {
    return null // Don't show the section if no featured properties
  }

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tighter">Featured Properties</h2>
            <p className="text-muted-foreground">Discover our handpicked selection of premium properties</p>
          </div>
          <Link href="/properties">
            <Button variant="outline">View All Properties</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={listing.image || "/placeholder.svg"}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-2 right-2">{listing.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-bold truncate">{listing.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                  <p className="font-bold text-lg">${listing.price.toLocaleString()}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{listing.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{listing.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center">
                      <Maximize className="h-4 w-4 mr-1" />
                      <span>{listing.area} sqft</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={`/properties/${listing.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

