import { Building, Users, Home, MessageSquare, Brain, Calculator, Shield, TrendingUp } from "lucide-react"
import Navigation from "@/components/navigation"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container px-4 py-8 md:px-6">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter mb-4">About ALPS</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            India's premier platform for coworking spaces and office rentals, powered by advanced AI technology 
            to provide accurate price predictions and seamless property transactions.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              At ALPS, we're revolutionizing the commercial real estate market by combining cutting-edge AI technology 
              with comprehensive property listings. Our platform specializes in coworking spaces and office rentals, 
              making it easier than ever for businesses to find their perfect workspace.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">AI-Powered Predictions</h3>
                  <p className="text-muted-foreground">
                    Our advanced machine learning models analyze property features and market data to provide accurate price predictions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Specialized Focus</h3>
                  <p className="text-muted-foreground">
                    Dedicated platform for coworking spaces and office rentals across major Indian cities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-16 bg-muted/50 py-12 rounded-lg">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Dedicated Desks</h3>
                <p className="text-muted-foreground">
                  Personal workspace solutions in vibrant coworking environments for freelancers and small teams.
                </p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Private Cabins</h3>
                <p className="text-muted-foreground">
                  Enclosed private office spaces with all amenities for focused work and team collaboration.
                </p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Managed Offices</h3>
                <p className="text-muted-foreground">
                  Fully serviced office solutions with comprehensive business support and infrastructure.
                </p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Office Rentals</h3>
                <p className="text-muted-foreground">
                  Commercial office spaces for rent with flexible terms and modern amenities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Advanced Technology</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">AI Price Prediction</h3>
                <p className="text-muted-foreground">
                  Our machine learning models analyze property features, amenities, and market trends to provide accurate price predictions.
                </p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Computer Vision</h3>
                <p className="text-muted-foreground">
                  Advanced image analysis using ResNet-50 to extract visual features and enhance prediction accuracy.
                </p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Data Security</h3>
                <p className="text-muted-foreground">
                  Enterprise-grade security measures to protect your data and ensure safe transactions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Coverage Section */}
        <section className="mb-16 bg-muted/50 py-12 rounded-lg">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Pan-India Coverage</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We serve major business hubs across India with comprehensive property listings and local market insights.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Noida", "New Delhi", "Gurgaon", "Bangalore", "Ahmedabad", "Chennai", "Hyderabad", "Mumbai", "Pune"].map((city) => (
                <div key={city} className="p-3 bg-background rounded-lg border">
                  <span className="font-medium">{city}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Ready to find your perfect workspace? Contact our team for personalized assistance and expert guidance.
          </p>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Email: contact@alps.com
            </p>
            <p className="text-muted-foreground">
              Phone: +91 98765 43210
            </p>
            <p className="text-muted-foreground">
              Address: ALPS Tower, Cyber City, Gurgaon, Haryana 122002
            </p>
          </div>
        </section>
      </main>
    </div>
  )
} 