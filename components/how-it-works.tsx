import { Building, MessageSquare, Search, UserCheck } from "lucide-react"

export default function HowItWorks() {
  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
          <p className="mt-2 text-muted-foreground md:text-lg">
            Our platform makes it easy to connect property sellers with potential buyers
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Building className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">List Your Property</h3>
            <p className="mt-2 text-muted-foreground">
              Sellers can create detailed listings with photos, descriptions, and pricing
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Search Properties</h3>
            <p className="mt-2 text-muted-foreground">
              Buyers can search and filter properties based on their preferences
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Connect Directly</h3>
            <p className="mt-2 text-muted-foreground">
              Our messaging system allows buyers and sellers to communicate directly
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Close the Deal</h3>
            <p className="mt-2 text-muted-foreground">
              Finalize transactions with confidence using our secure platform
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

