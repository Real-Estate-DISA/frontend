"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { propertyService, Property, LocationFeatures } from "@/lib/services/property.service"
import { userService } from "@/lib/services/user.service"
import Navigation from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"

const propertyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Property type is required"),
  price: z.coerce.number().min(1, "Price is required"),
  bedrooms: z.coerce.number().min(1, "Number of bedrooms is required"),
  bathrooms: z.coerce.number().min(1, "Number of bathrooms is required"),
  area: z.coerce.number().min(1, "Area is required"),
  location: z.string().min(1, "Location is required"),
  address: z.string().min(1, "Address is required"),
  image: z.string().min(1, "Image URL is required"),
})

type PropertyFormValues = z.infer<typeof propertyFormSchema>

export default function SellersPage() {
  const router = useRouter()
  const { user, loading, userRole } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const [hasPrediction, setHasPrediction] = useState(false)
  const [locationFeatures, setLocationFeatures] = useState<LocationFeatures | null>(null)

  // Check authentication and role
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login?redirect=/sellers")
        return
      }
      if (userRole !== "seller") {
        router.push("/become-seller")
        return
      }
    }
  }, [user, loading, userRole, router])

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      location: "",
      address: "",
      image: "",
    },
  })

  const predictPrice = async (data: PropertyFormValues) => {
    try {
      setIsPredicting(true)
      setError(null)
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          area: data.area,
          location: data.location,
          property_type: data.type,
          address: data.address
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get price prediction')
      }

      const result = await response.json()
      setPredictedPrice(result.predicted_price)
      setLocationFeatures(result.location_features)
      setHasPrediction(true)
      return result.predicted_price
    } catch (error: any) {
      console.error('Error predicting price:', error)
      setError('Failed to get price prediction')
      return null
    } finally {
      setIsPredicting(false)
    }
  }

  const onSubmit = async (data: PropertyFormValues) => {
    if (!user) {
      setError("You must be logged in to create a property listing")
      return
    }

    if (!predictedPrice || !locationFeatures) {
      setError("Please get a price prediction first")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      await propertyService.createProperty({
        ...data,
        featured: false,
        createdAt: new Date(),
        userId: user.uid,
        predictedPrice,
        locationFeatures
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error creating property:", error)
      setError(error.message || "Failed to create property listing")
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

  if (!user || userRole !== "seller") {
    return null
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container px-4 py-8 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">List Your Property</h1>
            <p className="text-muted-foreground">Fill out the form below to list your property.</p>
          </div>

          {error && (
            <div className="mt-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Modern Apartment in Downtown" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your property..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="condo">Condo</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ny">New York</SelectItem>
                          <SelectItem value="ca">California</SelectItem>
                          <SelectItem value="fl">Florida</SelectItem>
                          <SelectItem value="tx">Texas</SelectItem>
                          <SelectItem value="il">Illinois</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter complete street address" {...field} />
                      </FormControl>
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter the complete street address for accurate location
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter your price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Predicted Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Click Predict Price to get prediction" 
                      value={predictedPrice || ''} 
                      disabled 
                    />
                  </FormControl>
                </FormItem>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Number of bedrooms" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Number of bathrooms" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area (sqft)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Total area" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Right-click on an image and select 'Copy image address'" {...field} />
                    </FormControl>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tip: Upload your image to a hosting service, then paste the direct image URL here
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button 
                  type="button"
                  onClick={() => predictPrice(form.getValues())}
                  disabled={isPredicting || !form.formState.isValid}
                  className="flex-1"
                >
                  {isPredicting ? "Predicting..." : "Predict Price"}
                </Button>

                {hasPrediction && (
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Listing..." : "Create Listing"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  )
}

