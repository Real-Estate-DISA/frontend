import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FeaturedListings from "@/components/featured-listings"
import HowItWorks from "@/components/how-it-works"
import Navigation from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navigation />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Find Your Dream Property with PropertyConnect
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Connecting property sellers and buyers in one seamless platform. Browse listings, connect with
                  sellers, and find your perfect property.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by location, property type..."
                    className="pl-8 rounded-full"
                  />
                </div>
                <Button className="w-full rounded-full">Search Properties</Button>
              </div>
            </div>
          </div>
        </section>

        <FeaturedListings />
        <HowItWorks />

        <section className="py-12 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm">For Sellers</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  List Your Property and Connect with Potential Buyers
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Create detailed listings, showcase your property with high-quality photos, and connect directly with
                  interested buyers.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/sellers">
                    <Button>Start Listing</Button>
                  </Link>
                  <Link href="/seller-guide">
                    <Button variant="outline">Learn More</Button>
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm">For Buyers</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Find Your Perfect Property with Ease
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Browse thousands of listings, filter by your preferences, and connect directly with sellers to find
                  your dream property.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/properties">
                    <Button>Browse Properties</Button>
                  </Link>
                  <Link href="/buyer-guide">
                    <Button variant="outline">Learn More</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 PropertyConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

