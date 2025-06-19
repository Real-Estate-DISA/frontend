"use client"

import { useState, useEffect } from "react"
import { Filter, Search, Building2, Users, Home, Briefcase } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PropertyListings from "@/components/property-listings"
import { PropertyFilter } from "@/lib/services/property.service"
import Navigation from "@/components/navigation"

// Property types for our real estate platform
const propertyTypes = [
  { value: "dedicated_desk", label: "Dedicated Desk", icon: Users, description: "Personal workspace in shared environment" },
  { value: "private_cabin", label: "Private Cabin", icon: Building2, description: "Enclosed private office space" },
  { value: "managed_office", label: "Managed Office", icon: Briefcase, description: "Fully serviced office solutions" },
  { value: "office_rent", label: "Office Rent", icon: Home, description: "Commercial office space for rent" }
]

// Cities from our ML models
const cities = [
  "Noida", "New Delhi", "Gurgaon", "Bangalore", "Ahmedabad", 
  "Chennai", "Hyderabad", "Mumbai", "Pune"
]

export default function PropertiesPage() {
  const [activeTab, setActiveTab] = useState("dedicated_desk")
  const [filters, setFilters] = useState<PropertyFilter>({
    type: "dedicated_desk",
    minPrice: 0,
    maxPrice: undefined,
    location: "any",
    searchTerm: "",
    // Coworking specific filters
    seating_capacity: "any",
    center_area: "any",
    weekly_hours: "any",
    // Office rent specific filters
    floor_size: "any",
    building_grade: "any",
    furnishing: "any"
  })
  const [appliedFilters, setAppliedFilters] = useState<PropertyFilter>(filters)
  const [showFilters, setShowFilters] = useState(false)
  const [propertyCount, setPropertyCount] = useState(0)
  const [priceRange, setPriceRange] = useState([0])

  // Update filters when tab changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, type: activeTab }))
    setAppliedFilters(prev => ({ ...prev, type: activeTab }))
  }, [activeTab])

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
      type: activeTab,
      minPrice: undefined,
      maxPrice: undefined,
      location: "any",
      searchTerm: filters.searchTerm, // Preserve search term
      seating_capacity: "any",
      center_area: "any",
      weekly_hours: "any",
      floor_size: "any",
      building_grade: "any",
      furnishing: "any"
    }
    setPriceRange([0])
    setFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
  }

  const isCoworkingType = (type: string) => {
    return ["dedicated_desk", "private_cabin", "managed_office"].includes(type)
  }

  const isOfficeRentType = (type: string) => {
    return type === "office_rent"
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          {/* Header Section */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
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

          {/* Property Type Tabs */}
          <div className="mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
                {propertyTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <TabsTrigger 
                      key={type.value} 
                      value={type.value} 
                      className="flex flex-col items-center gap-2 py-6 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Icon className="h-5 w-5" />
                      <div className="text-center">
                        <div className="font-medium text-sm lg:text-base">{type.label}</div>
                        <div className="text-xs text-muted-foreground hidden lg:block mt-1">{type.description}</div>
                      </div>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>
          </div>

          {/* Mobile Filter Toggle */}
          {showFilters && (
            <div className="lg:hidden mb-6">
              <div className="rounded-lg border p-4 bg-background">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-medium">Location</h3>
                    <Select
                      value={filters.location}
                      onValueChange={(value) => handleFilterChange("location", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Location</SelectItem>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">Price Range (₹/month)</h3>
                    <Slider
                      value={priceRange}
                      onValueChange={handlePriceRangeChange}
                      max={200000}
                      step={5000}
                      className="mt-4"
                    />
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span>₹{priceRange[0].toLocaleString()}</span>
                      <span>{priceRange[0] === 200000 ? "₹2L+" : `₹${priceRange[0].toLocaleString()}`}</span>
                    </div>
                  </div>

                  {/* Coworking Specific Filters */}
                  {isCoworkingType(activeTab) && (
                    <>
                      <div>
                        <h3 className="mb-2 font-medium">Seating Capacity</h3>
                        <Select
                          value={filters.seating_capacity}
                          onValueChange={(value) => handleFilterChange("seating_capacity", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select capacity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="50">50+</SelectItem>
                            <SelectItem value="100">100+</SelectItem>
                            <SelectItem value="200">200+</SelectItem>
                            <SelectItem value="500">500+</SelectItem>
                            <SelectItem value="1000">1000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h3 className="mb-2 font-medium">Center Area (sq ft)</h3>
                        <Select
                          value={filters.center_area}
                          onValueChange={(value) => handleFilterChange("center_area", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="5000">5,000+</SelectItem>
                            <SelectItem value="10000">10,000+</SelectItem>
                            <SelectItem value="20000">20,000+</SelectItem>
                            <SelectItem value="50000">50,000+</SelectItem>
                            <SelectItem value="100000">1,00,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h3 className="mb-2 font-medium">Weekly Hours</h3>
                        <Select
                          value={filters.weekly_hours}
                          onValueChange={(value) => handleFilterChange("weekly_hours", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select hours" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="40">40+ hours</SelectItem>
                            <SelectItem value="50">50+ hours</SelectItem>
                            <SelectItem value="60">60+ hours</SelectItem>
                            <SelectItem value="70">70+ hours</SelectItem>
                            <SelectItem value="80">80+ hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {/* Office Rent Specific Filters */}
                  {isOfficeRentType(activeTab) && (
                    <>
                      <div>
                        <h3 className="mb-2 font-medium">Floor Size (sq ft)</h3>
                        <Select
                          value={filters.floor_size}
                          onValueChange={(value) => handleFilterChange("floor_size", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select floor size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="500">500+</SelectItem>
                            <SelectItem value="1000">1,000+</SelectItem>
                            <SelectItem value="2000">2,000+</SelectItem>
                            <SelectItem value="5000">5,000+</SelectItem>
                            <SelectItem value="10000">10,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h3 className="mb-2 font-medium">Building Grade</h3>
                        <Select
                          value={filters.building_grade}
                          onValueChange={(value) => handleFilterChange("building_grade", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="1">Grade A</SelectItem>
                            <SelectItem value="2">Grade B</SelectItem>
                            <SelectItem value="3">Grade C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h3 className="mb-2 font-medium">Furnishing</h3>
                        <Select
                          value={filters.furnishing}
                          onValueChange={(value) => handleFilterChange("furnishing", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select furnishing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="furnished">Furnished</SelectItem>
                            <SelectItem value="unfurnished">Unfurnished</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1" onClick={handleApplyFilters}>
                      Apply Filters
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={handleResetFilters}>
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-4 space-y-6 rounded-lg border p-6 bg-background">
                <div>
                  <h3 className="mb-3 font-semibold text-lg">Filters</h3>
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
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Price Range (₹/month)</h3>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={handlePriceRangeChange}
                      max={200000}
                      step={5000}
                      className="mt-6"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span>₹{priceRange[0].toLocaleString()}</span>
                      <span>{priceRange[0] === 200000 ? "₹2L+" : `₹${priceRange[0].toLocaleString()}`}</span>
                    </div>
                  </div>
                </div>

                {/* Coworking Specific Filters */}
                {isCoworkingType(activeTab) && (
                  <>
                    <div>
                      <h3 className="mb-2 font-medium">Seating Capacity</h3>
                      <div className="space-y-2">
                        <Select
                          value={filters.seating_capacity}
                          onValueChange={(value) => handleFilterChange("seating_capacity", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select capacity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="50">50+</SelectItem>
                            <SelectItem value="100">100+</SelectItem>
                            <SelectItem value="200">200+</SelectItem>
                            <SelectItem value="500">500+</SelectItem>
                            <SelectItem value="1000">1000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 font-medium">Center Area (sq ft)</h3>
                      <div className="space-y-2">
                        <Select
                          value={filters.center_area}
                          onValueChange={(value) => handleFilterChange("center_area", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="5000">5,000+</SelectItem>
                            <SelectItem value="10000">10,000+</SelectItem>
                            <SelectItem value="20000">20,000+</SelectItem>
                            <SelectItem value="50000">50,000+</SelectItem>
                            <SelectItem value="100000">1,00,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 font-medium">Weekly Hours</h3>
                      <div className="space-y-2">
                        <Select
                          value={filters.weekly_hours}
                          onValueChange={(value) => handleFilterChange("weekly_hours", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select hours" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="40">40+ hours</SelectItem>
                            <SelectItem value="50">50+ hours</SelectItem>
                            <SelectItem value="60">60+ hours</SelectItem>
                            <SelectItem value="70">70+ hours</SelectItem>
                            <SelectItem value="80">80+ hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {/* Office Rent Specific Filters */}
                {isOfficeRentType(activeTab) && (
                  <>
                    <div>
                      <h3 className="mb-2 font-medium">Floor Size (sq ft)</h3>
                      <div className="space-y-2">
                        <Select
                          value={filters.floor_size}
                          onValueChange={(value) => handleFilterChange("floor_size", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select floor size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="500">500+</SelectItem>
                            <SelectItem value="1000">1,000+</SelectItem>
                            <SelectItem value="2000">2,000+</SelectItem>
                            <SelectItem value="5000">5,000+</SelectItem>
                            <SelectItem value="10000">10,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 font-medium">Building Grade</h3>
                      <div className="space-y-2">
                        <Select
                          value={filters.building_grade}
                          onValueChange={(value) => handleFilterChange("building_grade", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="1">Grade A</SelectItem>
                            <SelectItem value="2">Grade B</SelectItem>
                            <SelectItem value="3">Grade C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 font-medium">Furnishing</h3>
                      <div className="space-y-2">
                        <Select
                          value={filters.furnishing}
                          onValueChange={(value) => handleFilterChange("furnishing", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select furnishing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="furnished">Furnished</SelectItem>
                            <SelectItem value="unfurnished">Unfurnished</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" onClick={handleApplyFilters}>
                    Apply Filters
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleResetFilters}>
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            {/* Property Listings */}
            <div className="lg:col-span-3">
              <PropertyListings filters={appliedFilters} onUpdateCount={setPropertyCount} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

