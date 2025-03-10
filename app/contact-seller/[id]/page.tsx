"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Property, propertyService } from "@/lib/services/property.service"
import { userService } from "@/lib/services/user.service"
import Navigation from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

const messageFormSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters long"),
})

type MessageFormValues = z.infer<typeof messageFormSchema>

export default function ContactSellerPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [property, setProperty] = useState<Property | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      message: "",
    },
  })

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyId = params.id as string
        const data = await propertyService.getPropertyById(propertyId)
        if (!data) {
          setError("Property not found")
          return
        }
        setProperty(data)
      } catch (err) {
        setError("Failed to fetch property details")
        console.error("Error fetching property:", err)
      }
    }

    fetchProperty()
  }, [params.id])

  const onSubmit = async (data: MessageFormValues) => {
    if (!user) {
      router.push(`/login?redirect=/contact-seller/${params.id}`)
      return
    }

    if (!property) {
      setError("Property not found")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      // Add message to Firestore
      await addDoc(collection(db, "messages"), {
        senderId: user.uid,
        senderEmail: user.email,
        receiverId: property.userId,
        propertyId: property.id,
        content: data.message,
        createdAt: serverTimestamp(),
        read: false,
      })

      // Show success message and redirect
      router.push("/dashboard?tab=messages")
    } catch (error: any) {
      console.error("Error sending message:", error)
      setError(error.message || "Failed to send message")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container px-4 py-8 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Contact Seller</h1>
            {property && (
              <p className="text-muted-foreground">
                Send a message about {property.title}
              </p>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {property && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/50">
              <div className="flex gap-4">
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold">{property.title}</h2>
                  <p className="text-muted-foreground">{property.location}</p>
                  <p className="font-medium">${property.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your message to the seller..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  )
} 