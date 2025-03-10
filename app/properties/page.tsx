"use client"

import { useState, useEffect } from "react"
import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import PropertyListings from "@/components/property-listings"
import { PropertyFilter } from "@/lib/services/property.service"
import Navigation from "@/components/navigation"

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilter>({
    type: "all",
    minPrice: 0,
    maxPrice: undefined,
    bedrooms: "any",
    bathrooms: "any",
    location: "any",
    searchTerm: "",
  })
  const [appliedFilters, setAppliedFilters] = useState<PropertyFilter>(filters)
  const [showFilters, setShowFilters] = useState(false)
  const [propertyCount, setPropertyCount] = useState(0)
  const [priceRange, setPriceRange] = useState([0])

  // Debug effect to log filter changes
  useEffect(() => {
    console.log('Current filters:', filters)
    console.log('Applied filters:', appliedFilters)
  }, [filters, appliedFilters])

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value)
    const maxPrice = value[0] === 2000000 ? undefined : value[0]
    setFilters((prev) => ({
      ...prev,
      minPrice: 0, // Always start from 0
      maxPrice: maxPrice,
    }))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value
    // Apply search immediately for better UX
    const newFilters = {
      ...filters,
      searchTerm: searchValue,
    }
    setFilters(newFilters)
    setAppliedFilters(newFilters)
  }

  const handleFilterChange = (key: keyof PropertyFilter, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters)
    setAppliedFilters({
      ...filters,
      // Ensure price range is properly set
      minPrice: priceRange[0] === 0 ? undefined : 0,
      maxPrice: priceRange[0] === 0 ? undefined : priceRange[0],
    })
    // On mobile, close the filters panel after applying
    if (window.innerWidth < 1024) {
      setShowFilters(false)
    }
  }

  const handleResetFilters = () => {
    const defaultFilters = {
      type: "all",
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: "any",
      bathrooms: "any",
      location: "any",
      searchTerm: filters.searchTerm, // Preserve search term
    }
    setPriceRange([0])
    setFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter">Browse Properties</h1>
              <p className="text-muted-foreground">
                {propertyCount} {propertyCount === 1 ? "property" : "properties"} found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by location, keyword..."
                  className="pl-8 w-full md:w-[300px]"
                  value={filters.searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-primary text-primary-foreground" : ""}
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-4">
            <div
              className={`lg:col-span-1 ${
                showFilters ? "block" : "hidden lg:block"
              } transition-all duration-200 ease-in-out`}
            >
              <div className="sticky top-4 space-y-6 rounded-lg border p-4">
                <div>
                  <h3 className="mb-2 font-medium">Property Type</h3>
                  <div className="space-y-2">
                    <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Properties</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Price Range</h3>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={handlePriceRangeChange}
                      max={2000000}
                      step={50000}
                      className="mt-6"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span>${priceRange[0].toLocaleString()}</span>
                      <span>{priceRange[0] === 2000000 ? "$2M+" : `$${priceRange[0].toLocaleString()}`}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Bedrooms</h3>
                  <div className="space-y-2">
                    <Select
                      value={filters.bedrooms}
                      onValueChange={(value) => handleFilterChange("bedrooms", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Bathrooms</h3>
                  <div className="space-y-2">
                    <Select
                      value={filters.bathrooms}
                      onValueChange={(value) => handleFilterChange("bathrooms", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Location</h3>
                  <div className="space-y-2">
                    <Select
                      value={filters.location}
                      onValueChange={(value) => handleFilterChange("location", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Location</SelectItem>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                        <SelectItem value="Miami">Miami</SelectItem>
                        <SelectItem value="Chicago">Chicago</SelectItem>
                        <SelectItem value="Houston">Houston</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleApplyFilters}>
                    Apply Filters
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleResetFilters}>
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            <div className={`${showFilters ? "hidden lg:block" : ""} lg:col-span-3`}>
              <PropertyListings filters={appliedFilters} onUpdateCount={setPropertyCount} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

