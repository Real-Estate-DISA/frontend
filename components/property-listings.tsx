"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bath, Bed, Heart, MapPin, Maximize } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Property, PropertyFilter, propertyService } from "@/lib/services/property.service"
import { userService } from "@/lib/services/user.service"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

interface PropertyListingsProps {
  filters?: PropertyFilter
  onUpdateCount?: (count: number) => void
}

export default function PropertyListings({ filters, onUpdateCount }: PropertyListingsProps) {
  const [listings, setListings] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [userId, setUserId] = useState<string | null>(null)

  // Handle authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null)
    })
    return () => unsubscribe()
  }, [])

  // Fetch user's favorites
  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (!userId) {
        setFavorites([])
        return
      }
      try {
        const user = await userService.getCurrentUser()
        if (user) {
          setFavorites(user.favorites || [])
        }
      } catch (err) {
        console.error("Error fetching favorites:", err)
      }
    }
    fetchUserFavorites()
  }, [userId])

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        setError(null)
        const properties = await propertyService.getProperties(filters)
        setListings(properties)
        onUpdateCount?.(properties.length)
      } catch (err) {
        setError("Failed to fetch properties. Please try again later.")
        console.error("Error fetching properties:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [filters, onUpdateCount])

  const toggleFavorite = async (id: string) => {
    if (!userId) {
      // Redirect to login or show login prompt
      return
    }

    try {
      if (favorites.includes(id)) {
        await userService.removeFromFavorites(id)
        setFavorites(prev => prev.filter(fav => fav !== id))
      } else {
        await userService.addToFavorites(id)
        setFavorites(prev => [...prev, id])
      }
    } catch (err) {
      console.error("Error updating favorites:", err)
    }
  }

  const getSortedListings = () => {
    return [...listings].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "size-asc":
          return a.area - b.area
        case "size-desc":
          return b.area - a.area
        case "newest":
        default:
          // Convert Firestore timestamps to milliseconds for comparison
          const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime()
          const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime()
          return dateB - dateA
      }
    })
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">Loading properties...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    )
  }

  const sortedListings = getSortedListings()

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-muted-foreground">
          Showing {sortedListings.length} {sortedListings.length === 1 ? "property" : "properties"}
        </p>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="size-asc">Size: Small to Large</SelectItem>
            <SelectItem value="size-desc">Size: Large to Small</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortedListings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No properties found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.href = '/properties'}
          >
            View All Properties
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {sortedListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden group">
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={listing.image || "/placeholder.svg"}
                    alt={listing.title}
                    className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                  />
                  <Badge className="absolute top-2 right-2">{listing.type}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2 bg-background/80 hover:bg-background/90 rounded-full transition-colors"
                    onClick={() => listing.id && toggleFavorite(listing.id)}
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors ${
                        listing.id && favorites.includes(listing.id) ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    <span className="sr-only">
                      {listing.id && favorites.includes(listing.id) ? "Remove from favorites" : "Add to favorites"}
                    </span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg line-clamp-1">{listing.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="line-clamp-1">{listing.location}</span>
                  </div>
                  <p className="font-bold text-xl">${listing.price.toLocaleString()}</p>
                  {listing.predictedPrice && (
                    <p className="text-sm text-muted-foreground">
                      Predicted: ${listing.predictedPrice.toLocaleString()}
                    </p>
                  )}
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
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Link href={`/properties/${listing.id}`} className="flex-1">
                  <Button variant="default" className="w-full">
                    View Details
                  </Button>
                </Link>
                {userId === listing.userId ? (
                  <>
                    <Link href={`/properties/${listing.id}/edit`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Edit
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={async () => {
                        if (listing.id && window.confirm('Are you sure you want to delete this property?')) {
                          try {
                            await propertyService.deleteProperty(listing.id)
                            setListings(listings.filter(p => p.id !== listing.id))
                          } catch (error) {
                            console.error('Error deleting property:', error)
                          }
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <Link href={`/contact-seller/${listing.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Contact Seller
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

