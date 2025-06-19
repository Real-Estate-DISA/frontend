import Link from "next/link"
import { Search, Building, Users, Home, Brain, Calculator, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FeaturedListings from "@/components/featured-listings"
import HowItWorks from "@/components/how-it-works"
import Navigation from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navigation />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Find Your Perfect Workspace with ALPS
                </h1>
                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl">
                  India's premier platform for coworking spaces and office rentals. Powered by AI technology 
                  for accurate price predictions and seamless property transactions.
                </p>
              </div>
              
              {/* Search Section */}
              <div className="w-full max-w-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dedicated-desk">Dedicated Desk</SelectItem>
                      <SelectItem value="private-cabin">Private Cabin</SelectItem>
                      <SelectItem value="managed-office">Managed Office</SelectItem>
                      <SelectItem value="office-rent">Office Rent</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="noida">Noida</SelectItem>
                      <SelectItem value="delhi">New Delhi</SelectItem>
                      <SelectItem value="gurgaon">Gurgaon</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search properties..."
                      className="pl-8"
                    />
                  </div>
                </div>
                <Button className="w-full">Search Workspaces</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
                Our Workspace Solutions
              </h2>
              <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                From dedicated desks to managed offices, we offer comprehensive workspace solutions for every business need.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-lg border bg-card">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Dedicated Desks</h3>
                <p className="text-muted-foreground text-sm">
                  Personal workspace solutions in vibrant coworking environments for freelancers and small teams.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg border bg-card">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Private Cabins</h3>
                <p className="text-muted-foreground text-sm">
                  Enclosed private office spaces with all amenities for focused work and team collaboration.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg border bg-card">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Managed Offices</h3>
                <p className="text-muted-foreground text-sm">
                  Fully serviced office solutions with comprehensive business support and infrastructure.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg border bg-card">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Office Rentals</h3>
                <p className="text-muted-foreground text-sm">
                  Commercial office spaces for rent with flexible terms and modern amenities.
                </p>
              </div>
            </div>
          </div>
        </section>

        <FeaturedListings />
        <HowItWorks />

        {/* AI Technology Section */}
        <section className="py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
                Powered by Advanced AI Technology
              </h2>
              <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Our machine learning models and computer vision technology provide accurate price predictions and market insights.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">AI Price Prediction</h3>
                <p className="text-muted-foreground">
                  Advanced algorithms analyze property features, amenities, and market trends for accurate pricing.
                </p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Computer Vision</h3>
                <p className="text-muted-foreground">
                  ResNet-50 image analysis extracts visual features to enhance prediction accuracy.
                </p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Market Insights</h3>
                <p className="text-muted-foreground">
                  Real-time market data and trends to help you make informed decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm">For Property Owners</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  List Your Workspace with AI-Powered Pricing
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Get accurate price predictions using our AI technology. Upload property images and details to receive 
                  market-competitive pricing recommendations.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/sellers">
                    <Button>List Your Property</Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline">Learn More</Button>
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm">For Businesses</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Find Your Perfect Workspace
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Browse thousands of coworking spaces and office rentals across India. Filter by location, 
                  amenities, and budget to find your ideal workspace.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/properties">
                    <Button>Browse Workspaces</Button>
                  </Link>
                  <Link href="/about">
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
            © 2025 ALPS. All rights reserved.
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

