"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Building, Heart, Home, MessageSquare, Plus } from "lucide-react"
import { collection, query, where, orderBy, getDocs, doc, updateDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navigation from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Property, propertyService } from "@/lib/services/property.service"
import { userService } from "@/lib/services/user.service"

interface Message {
  id: string
  senderId: string
  senderEmail: string
  receiverId: string
  propertyId: string
  content: string
  read: boolean
  createdAt: Timestamp | Date
}

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [userProperties, setUserProperties] = useState<Property[]>([])
  const [userFavorites, setUserFavorites] = useState<Property[]>([])
  const [userMessages, setUserMessages] = useState<Message[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const defaultTab = searchParams.get('tab') || 'properties'

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push("/login")
      return
    }

    const fetchDashboardData = async () => {
      if (!user) return

      try {
        setLoadingData(true)
        // Fetch user's properties
        const properties = await propertyService.getProperties({ userId: user.uid })
        setUserProperties(properties)

        // Fetch user's data to get favorites
        const userData = await userService.getCurrentUser()
        if (userData?.favorites?.length) {
          // Fetch favorite properties
          const favoriteProperties = await Promise.all(
            userData.favorites.map(id => propertyService.getPropertyById(id))
          )
          setUserFavorites(favoriteProperties.filter((p): p is Property => p !== null))
        }

        // Fetch messages with proper error handling
        try {
          const messagesQuery = query(
            collection(db, "messages"),
            where("receiverId", "==", user.uid)
          )
          const querySnapshot = await getDocs(messagesQuery)
          const messages = querySnapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate() || new Date()
            })) as Message[]
          
          // Sort messages in memory instead of using orderBy
          messages.sort((a, b) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt.seconds * 1000)
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt.seconds * 1000)
            return dateB.getTime() - dateA.getTime()
          })
          
          setUserMessages(messages)
        } catch (messageError) {
          console.error("Error fetching messages:", messageError)
          // Don't let message errors prevent loading other dashboard data
          setUserMessages([])
        }
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoadingData(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user, loading, router])

  if (loading || loadingData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      await userService.removeFromFavorites(propertyId)
      setUserFavorites(prev => prev.filter(p => p.id !== propertyId))
    } catch (error) {
      console.error("Error removing favorite:", error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter">Dashboard</h1>
              <p className="text-muted-foreground">Manage your properties, favorites, and messages</p>
            </div>
            <Link href="/sellers">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                List New Property
              </Button>
            </Link>
          </div>

          <Tabs defaultValue={defaultTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="properties">
                <Home className="mr-2 h-4 w-4" />
                My Properties
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Heart className="mr-2 h-4 w-4" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages {userMessages.filter(m => !m.read).length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                    {userMessages.filter(m => !m.read).length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="properties">
              {userProperties.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {userProperties.map((property) => (
                    <Card key={property.id}>
                      <CardHeader className="p-0">
                        <div className="relative">
                          <img
                            src={property.image || "/placeholder.svg"}
                            alt={property.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <h3 className="font-bold truncate">{property.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{property.location}</p>
                        <p className="font-bold text-lg mt-2">${property.price.toLocaleString()}</p>
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span>{property.bedrooms} Beds</span>
                          <span>{property.bathrooms} Baths</span>
                          <span>{property.area} sqft</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Link href={`/properties/${property.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View
                          </Button>
                        </Link>
                        <Link href={`/properties/${property.id}/edit`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            Edit
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Building className="h-12 w-12 text-muted-foreground mb-4" />
                    <CardTitle className="mb-2">No Properties Listed</CardTitle>
                    <CardDescription className="mb-4 text-center max-w-md">
                      You haven't listed any properties yet. Start listing your properties to connect with potential
                      buyers.
                    </CardDescription>
                    <Link href="/sellers">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        List New Property
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="favorites">
              {userFavorites.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {userFavorites.map((property) => (
                    <Card key={property.id}>
                      <CardHeader className="p-0">
                        <div className="relative">
                          <img
                            src={property.image || "/placeholder.svg"}
                            alt={property.title}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <h3 className="font-bold truncate">{property.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{property.location}</p>
                        <p className="font-bold text-lg mt-2">${property.price.toLocaleString()}</p>
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span>{property.bedrooms} Beds</span>
                          <span>{property.bathrooms} Baths</span>
                          <span>{property.area} sqft</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Link href={`/properties/${property.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => property.id && handleRemoveFavorite(property.id)}
                        >
                          <Heart className="h-4 w-4 mr-2 fill-current text-red-500" />
                          Remove
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                    <CardTitle className="mb-2">No Favorites Yet</CardTitle>
                    <CardDescription className="mb-4 text-center max-w-md">
                      You haven't added any properties to your favorites yet. Browse properties and click the heart icon
                      to add them to your favorites.
                    </CardDescription>
                    <Link href="/properties">
                      <Button>Browse Properties</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="messages">
              {loadingData ? (
                <div className="text-center py-8">
                  <p>Loading messages...</p>
                </div>
              ) : userMessages.length > 0 ? (
                <div className="space-y-4">
                  {userMessages.map((message) => {
                    const property = userProperties.find((p) => p.id === message.propertyId)
                    const messageDate = message.createdAt instanceof Date 
                      ? message.createdAt 
                      : new Date(message.createdAt.seconds * 1000)
                    
                    return (
                      <Card key={message.id} className={message.read ? "" : "border-primary"}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">
                                Message from: {message.senderEmail}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                About property: {property?.title || "Unknown Property"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Sent on: {messageDate.toLocaleDateString()}
                              </p>
                            </div>
                            {!message.read && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                New
                              </span>
                            )}
                          </div>
                          <p className="mt-2">{message.content}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={async () => {
                              try {
                                const messageRef = doc(db, "messages", message.id)
                                await updateDoc(messageRef, { read: true })
                                setUserMessages(prev => 
                                  prev.map(m => 
                                    m.id === message.id ? { ...m, read: true } : m
                                  )
                                )
                              } catch (error) {
                                console.error("Error marking message as read:", error)
                              }
                            }}
                          >
                            Mark as Read
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <CardTitle className="mb-2">No Messages</CardTitle>
                    <CardDescription className="mb-4 text-center max-w-md">
                      You don't have any messages yet. When buyers contact you about your properties, their messages
                      will appear here.
                    </CardDescription>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

