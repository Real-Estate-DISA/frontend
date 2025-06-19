import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"

export default function SuccessPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container px-4 py-16 md:px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="rounded-full bg-green-100 p-3 w-12 h-12 mx-auto mb-6 flex items-center justify-center">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Property Listed Successfully!</h1>
          <p className="text-muted-foreground mb-8">
            Your workspace has been successfully listed on ALPS. Potential tenants will be able to view your
            listing and contact you for more information.
          </p>
          <div className="space-y-4">
            <Link href="/properties">
              <Button className="w-full">View All Properties</Button>
            </Link>
            <Link href="/sellers">
              <Button variant="outline" className="w-full">
                List Another Property
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

