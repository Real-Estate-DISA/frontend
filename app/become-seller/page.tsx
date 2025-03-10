"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navigation from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { userService } from "@/lib/services/user.service"

export default function BecomeSeller() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleBecomeSeller = async () => {
    if (!user) {
      router.push("/login?redirect=/become-seller")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      // Update user role to seller
      await userService.updateUser(user.uid, { role: "seller" })
      
      // Redirect to sellers page
      router.push("/sellers")
    } catch (error: any) {
      console.error("Error becoming a seller:", error)
      setError(error.message || "Failed to become a seller")
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
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-2xl">Become a Seller</CardTitle>
            <CardDescription>
              Start listing your properties and connect with potential buyers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="mb-4">
                As a seller, you'll be able to:
              </p>
              <ul className="text-left space-y-2 mb-6">
                <li>✓ List multiple properties</li>
                <li>✓ Manage your listings</li>
                <li>✓ Connect with potential buyers</li>
                <li>✓ Track property views and interest</li>
              </ul>
              {error && (
                <p className="text-sm text-red-500 mb-4">{error}</p>
              )}
              <Button 
                onClick={handleBecomeSeller} 
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? "Processing..." : "Become a Seller"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 