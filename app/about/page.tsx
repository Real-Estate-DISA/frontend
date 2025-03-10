import { Building, Users, Home, MessageSquare } from "lucide-react"
import Navigation from "@/components/navigation"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container px-4 py-8 md:px-6">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter mb-4">About PropertyConnect</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connecting property sellers and buyers through an innovative digital platform, making real estate transactions seamless and efficient.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              At PropertyConnect, we're dedicated to revolutionizing the real estate industry by creating a transparent, 
              efficient, and user-friendly platform that connects property sellers directly with potential buyers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Quality Listings</h3>
                  <p className="text-muted-foreground">
                    We ensure all property listings are verified and provide comprehensive information for buyers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Direct Communication</h3>
                  <p className="text-muted-foreground">
                    Enable direct communication between buyers and sellers for more efficient transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16 bg-muted/50 py-12 rounded-lg">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">What Sets Us Apart</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Extensive Property Database</h3>
                <p className="text-muted-foreground">
                  Access to a wide range of properties across different locations and price ranges.
                </p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Seamless Communication</h3>
                <p className="text-muted-foreground">
                  Built-in messaging system for easy communication between buyers and sellers.
                </p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">User-Focused Platform</h3>
                <p className="text-muted-foreground">
                  Intuitive interface designed to make property transactions simple and efficient.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions about PropertyConnect? We're here to help you with any inquiries about our platform.
          </p>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Email: contact@propertyconnect.com
            </p>
            <p className="text-muted-foreground">
              Phone: (555) 123-4567
            </p>
            <p className="text-muted-foreground">
              Address: 123 Property Street, Real Estate City, 12345
            </p>
          </div>
        </section>
      </main>
    </div>
  )
} 