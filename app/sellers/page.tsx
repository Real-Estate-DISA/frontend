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
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, MapPin, DollarSign, Upload, Calculator, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
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

interface PropertyFormData {
  // Common fields
  propertyType: string;
  city: string;
  total_weekly_hours: number;
  days_open_per_week: number;
  has_different_timings: boolean;
  weekday_opening_time: string;
  weekday_closing_time: string;
  
  // Location fields
  nearest_metro_distance: number;
  nearest_bus_distance: number;
  nearest_train_distance: number;
  nearest_airport_distance: number;
  nearest_hospital_distance: number;
  
  // Coworking amenities (all from CSV)
  "2_wheeler_parking": boolean;
  "4_wheeler_parking": boolean;
  "air_conditioners": boolean;
  "air_filters": boolean;
  "breakout_recreational_area": boolean;
  "bus": boolean;
  "cafeteria": boolean;
  "chairs_desks": boolean;
  "charging": boolean;
  "coffee": boolean;
  "conference_room": boolean;
  "event_space": boolean;
  "fire_extinguisher": boolean;
  "first_aid_kit": boolean;
  "fitness_centre": boolean;
  "indoor_plants": boolean;
  "lan": boolean;
  "library": boolean;
  "lift": boolean;
  "lounge_area": boolean;
  "lunch": boolean;
  "meeting_rooms": boolean;
  "metro_connectivity": boolean;
  "nearby_eateries": boolean;
  "outdoor_seating": boolean;
  "pantry_area": boolean;
  "pet_friendly": boolean;
  "phone_booth": boolean;
  "power_backup": boolean;
  "printer": boolean;
  "rental_cycles_evs": boolean;
  "security_personnel": boolean;
  "separate_washroom": boolean;
  "shuttle": boolean;
  "single_washroom": boolean;
  "smoke_alarms": boolean;
  "snacks_drinks": boolean;
  "stationery": boolean;
  "storage_space": boolean;
  "tea": boolean;
  "training_room": boolean;
  "washroom_near_premise": boolean;
  "water": boolean;
  "wellness_centre": boolean;
  "wifi": boolean;
  
  // Coworking specific fields
  total_center_area?: number;
  total_seating_capacity?: number;
  typical_floorplate_area?: number;
  building_type_business_park?: boolean;
  building_type_independent_commercial_tower?: boolean;
  
  // Office rent specific fields
  floor_size?: number;
  lock_in?: number;
  floors?: number;
  building_grade?: number;
  year_built?: number;
  
  // Furnishing and building type (office rent)
  furnishing_fully_furnished?: boolean;
  furnishing_unfurnished?: boolean;
  building_type_business_tower?: boolean;
  building_type_it_ites?: boolean;
  building_type_independent_commercial_tower_office?: boolean;
  
  // Additional details
  description: string;
  contact_number: string;
  email: string;
  images: File[];
}

const initialFormData: PropertyFormData = {
  propertyType: "",
  city: "",
  total_weekly_hours: 0,
  days_open_per_week: 0,
  has_different_timings: false,
  weekday_opening_time: "",
  weekday_closing_time: "",
  nearest_metro_distance: 0,
  nearest_bus_distance: 0,
  nearest_train_distance: 0,
  nearest_airport_distance: 0,
  nearest_hospital_distance: 0,
  "2_wheeler_parking": false,
  "4_wheeler_parking": false,
  "air_conditioners": false,
  "air_filters": false,
  "breakout_recreational_area": false,
  "bus": false,
  "cafeteria": false,
  "chairs_desks": false,
  "charging": false,
  "coffee": false,
  "conference_room": false,
  "event_space": false,
  "fire_extinguisher": false,
  "first_aid_kit": false,
  "fitness_centre": false,
  "indoor_plants": false,
  "lan": false,
  "library": false,
  "lift": false,
  "lounge_area": false,
  "lunch": false,
  "meeting_rooms": false,
  "metro_connectivity": false,
  "nearby_eateries": false,
  "outdoor_seating": false,
  "pantry_area": false,
  "pet_friendly": false,
  "phone_booth": false,
  "power_backup": false,
  "printer": false,
  "rental_cycles_evs": false,
  "security_personnel": false,
  "separate_washroom": false,
  "shuttle": false,
  "single_washroom": false,
  "smoke_alarms": false,
  "snacks_drinks": false,
  "stationery": false,
  "storage_space": false,
  "tea": false,
  "training_room": false,
  "washroom_near_premise": false,
  "water": false,
  "wellness_centre": false,
  "wifi": false,
  description: "",
  contact_number: "",
  email: "",
  images: []
};

const cities = [
  "noida", "new_delhi", "gurgaon", "bangalore", "ahmedabad", 
  "chennai", "hyderabad", "mumbai", "pune", "kolkata"
];

const propertyTypes = [
  { value: "coworking_dedicated_desk", label: "Coworking - Dedicated Desk" },
  { value: "coworking_private_cabin", label: "Coworking - Private Cabin" },
  { value: "coworking_managed_office", label: "Coworking - Managed Office" },
  { value: "office_rent", label: "Office Rent (Commercial)" }
];

// Coworking amenities based on CSV data
const coworkingAmenities = [
  // Parking & Transportation
  { id: "2_wheeler_parking", label: "2 Wheeler Parking" },
  { id: "4_wheeler_parking", label: "4 Wheeler Parking" },
  { id: "shuttle", label: "Shuttle Service" },
  { id: "rental_cycles_evs", label: "Rental Cycles/EVs" },
  { id: "bus", label: "Bus Connectivity" },
  { id: "metro_connectivity", label: "Metro Connectivity" },
  
  // Basic Infrastructure
  { id: "air_conditioners", label: "Air Conditioners" },
  { id: "air_filters", label: "Air Filters" },
  { id: "power_backup", label: "Power Backup" },
  { id: "wifi", label: "WiFi" },
  { id: "lan", label: "LAN" },
  { id: "lift", label: "Lift" },
  { id: "charging", label: "Charging Points" },
  
  // Workspace Essentials
  { id: "chairs_desks", label: "Chairs & Desks" },
  { id: "printer", label: "Printer" },
  { id: "stationery", label: "Stationery" },
  { id: "storage_space", label: "Storage Space" },
  { id: "phone_booth", label: "Phone Booth" },
  
  // Meeting & Conference
  { id: "conference_room", label: "Conference Room" },
  { id: "meeting_rooms", label: "Meeting Rooms" },
  { id: "training_room", label: "Training Room" },
  { id: "event_space", label: "Event Space" },
  
  // Food & Beverages
  { id: "cafeteria", label: "Cafeteria" },
  { id: "pantry_area", label: "Pantry Area" },
  { id: "coffee", label: "Coffee" },
  { id: "tea", label: "Tea" },
  { id: "lunch", label: "Lunch Service" },
  { id: "snacks_drinks", label: "Snacks & Drinks" },
  { id: "nearby_eateries", label: "Nearby Eateries" },
  
  // Recreation & Wellness
  { id: "breakout_recreational_area", label: "Breakout & Recreational Area" },
  { id: "lounge_area", label: "Lounge Area" },
  { id: "outdoor_seating", label: "Outdoor Seating" },
  { id: "fitness_centre", label: "Fitness Centre" },
  { id: "wellness_centre", label: "Wellness Centre" },
  { id: "library", label: "Library" },
  
  // Safety & Security
  { id: "fire_extinguisher", label: "Fire Extinguisher" },
  { id: "first_aid_kit", label: "First Aid Kit" },
  { id: "smoke_alarms", label: "Smoke Alarms" },
  { id: "security_personnel", label: "Security Personnel" },
  
  // Facilities
  { id: "separate_washroom", label: "Separate Washroom" },
  { id: "single_washroom", label: "Single Washroom" },
  { id: "washroom_near_premise", label: "Washroom Near Premise" },
  { id: "water", label: "Water" },
  
  // Additional Features
  { id: "indoor_plants", label: "Indoor Plants" },
  { id: "pet_friendly", label: "Pet Friendly" },
  { id: "has_different_timings", label: "Different Timings" }
];

export default function SellersPage() {
  const router = useRouter()
  const { user, loading, userRole } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const [hasPrediction, setHasPrediction] = useState(false)
  const [locationFeatures, setLocationFeatures] = useState<LocationFeatures | null>(null)
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData)
  const [activeTab, setActiveTab] = useState("details")

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

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field: keyof PropertyFormData, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }))
  }

  const handleRadioChange = (field: keyof PropertyFormData, value: string) => {
    // For building type radio buttons, set the selected one to true and others to false
    if (field.includes('building_type')) {
      setFormData(prev => {
        const newData = { ...prev }
        // Set all building type fields to false first
        if (prev.propertyType.startsWith('coworking')) {
          newData.building_type_business_park = false
          newData.building_type_independent_commercial_tower = false
        } else if (prev.propertyType === 'office_rent') {
          newData.building_type_business_tower = false
          newData.building_type_it_ites = false
          newData.building_type_independent_commercial_tower_office = false
        }
        // Set the selected field to true
        ;(newData as any)[field] = true
        return newData
      })
    } else {
      // For other radio buttons (like furnishing)
      setFormData(prev => {
        const newData = { ...prev }
        if (field === 'furnishing_fully_furnished') {
          newData.furnishing_fully_furnished = true
          newData.furnishing_unfurnished = false
        } else if (field === 'furnishing_unfurnished') {
          newData.furnishing_fully_furnished = false
          newData.furnishing_unfurnished = true
        }
        return newData
      })
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData(prev => ({ ...prev, images: files }))
  }

  const prepareDataForAPI = () => {
    const data: any = {
      city: formData.city,
      total_weekly_hours: Number(formData.total_weekly_hours) || 0,
      days_open_per_week: Number(formData.days_open_per_week) || 0,
      has_different_timings: formData.has_different_timings ? 1 : 0,
      weekday_opening_time: formData.weekday_opening_time,
      weekday_closing_time: formData.weekday_closing_time,
      nearest_metro_distance: Number(formData.nearest_metro_distance) || 0,
      nearest_bus_distance: Number(formData.nearest_bus_distance) || 0,
      nearest_train_distance: Number(formData.nearest_train_distance) || 0,
      nearest_airport_distance: Number(formData.nearest_airport_distance) || 0,
      nearest_hospital_distance: Number(formData.nearest_hospital_distance) || 0,
      "2 wheeler parking": formData["2_wheeler_parking"] ? 1 : 0,
      "4 wheeler parking": formData["4_wheeler_parking"] ? 1 : 0,
      "Air Conditioners": formData.air_conditioners ? 1 : 0,
      "Lift": formData.lift ? 1 : 0,
      "Meeting Rooms": formData.meeting_rooms ? 1 : 0,
      "Pantry Area": formData.pantry_area ? 1 : 0,
      "Power Backup": formData.power_backup ? 1 : 0,
      "Wifi": formData.wifi ? 1 : 0,
    }

    // Add city encoding
    cities.forEach(city => {
      data[`city_${city}`] = formData.city === city ? 1 : 0
    })

    // Add property type specific fields
    if (formData.propertyType.startsWith("coworking")) {
      data.total_center_area = Number(formData.total_center_area) || 0
      data.total_seating_capacity = Number(formData.total_seating_capacity) || 0
      data.typical_floorplate_area = Number(formData.typical_floorplate_area) || 0
      data.building_type_business_park = formData.building_type_business_park ? 1 : 0
      data.building_type_independent_commercial_tower = formData.building_type_independent_commercial_tower ? 1 : 0
    } else if (formData.propertyType === "office_rent") {
      data.floor_size = Number(formData.floor_size) || 0
      data.lock_in = Number(formData.lock_in) || 0
      data.floors = Number(formData.floors) || 0
      data.building_grade = Number(formData.building_grade) || 0
      data.year_built = Number(formData.year_built) || 0
      data.air_conditioning = formData.air_conditioners ? 1 : 0
      data.furnishing_Fully_Furnished = formData.furnishing_fully_furnished ? 1 : 0
      data.furnishing_Unfurnished = formData.furnishing_unfurnished ? 1 : 0
      data.building_type_Business_Tower = formData.building_type_business_tower ? 1 : 0
      data["building_type_IT/ITeS"] = formData.building_type_it_ites ? 1 : 0
      data.building_type_Independent_Commercial_Tower = formData.building_type_independent_commercial_tower_office ? 1 : 0
    }

    return data
  }

  const predictPrice = async () => {
    if (!formData.propertyType || !formData.city) {
      toast({
        title: "Validation Error",
        description: "Please select property type and city",
        variant: "destructive",
      })
      return
    }

    setIsPredicting(true)
    try {
      const data = prepareDataForAPI()
      const endpoint = formData.propertyType.startsWith("coworking") 
        ? "/predict/coworking" 
        : "/predict/office_rent"

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Send data directly, not wrapped in {data: data}
      })

      if (!response.ok) {
        throw new Error("Failed to get prediction")
      }

      const result = await response.json()
      
      // Handle different response structures
      let predictedPrice = null
      if (formData.propertyType.startsWith("coworking")) {
        // For coworking, get the first available prediction
        const predictions = result.predictions
        if (predictions && Object.keys(predictions).length > 0) {
          const firstPrediction = Object.values(predictions)[0] as any
          predictedPrice = firstPrediction.predicted_price
        }
      } else {
        // For office rent
        predictedPrice = result.prediction?.predicted_rent
      }
      
      if (predictedPrice) {
        setPredictedPrice(predictedPrice)
        setHasPrediction(true)
        
        toast({
          title: "Price Prediction Successful",
          description: `Predicted price: ₹${predictedPrice.toLocaleString()}`,
        })
      } else {
        throw new Error("No prediction received")
      }
    } catch (error) {
      console.error("Prediction error:", error)
      toast({
        title: "Prediction Failed",
        description: "Failed to get price prediction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPredicting(false)
    }
  }

  const uploadProperty = async () => {
    // Prevent multiple simultaneous uploads
    if (isSubmitting) {
      console.log("Upload already in progress, ignoring duplicate request")
      return
    }

    if (!predictedPrice) {
      toast({
        title: "No Price Prediction",
        description: "Please get a price prediction first",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload a property",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setError(null) // Clear any previous errors
    
    try {
      console.log("Starting property upload...")
      
      // Use placeholder images instead of uploading to Firebase Storage (to avoid CORS issues)
      const imageUrls: string[] = []
      
      if (formData.images.length > 0) {
        // Generate placeholder URLs for each uploaded image
        formData.images.forEach((image, index) => {
          imageUrls.push(`https://via.placeholder.com/400x300/cccccc/666666?text=Property+Image+${index + 1}`)
        })
      } else {
        // Default placeholder if no images
        imageUrls.push("https://via.placeholder.com/400x300/cccccc/666666?text=Property+Image")
      }

      console.log(`Generated ${imageUrls.length} placeholder image URLs`)

      // Prepare property data for Firestore
      const propertyData = {
        title: `${formData.propertyType.replace('_', ' ').toUpperCase()} - ${formData.city}`,
        location: formData.city,
        address: `${formData.city}, India`,
        price: predictedPrice,
        bedrooms: 0, // Not applicable for coworking/office spaces
        bathrooms: 1, // Default value
        area: formData.total_center_area || formData.floor_size || 1000,
        image: imageUrls[0] || "/placeholder.svg",
        type: formData.propertyType,
        featured: false,
        userId: user.uid,
        description: formData.description || `Premium ${formData.propertyType.replace('_', ' ')} space in ${formData.city}`,
        predictedPrice: predictedPrice,
        createdAt: new Date(),
        
        // Additional coworking/office specific data
        propertyDetails: {
          // Common fields
          city: formData.city,
          total_weekly_hours: formData.total_weekly_hours || 0,
          days_open_per_week: formData.days_open_per_week || 0,
          has_different_timings: formData.has_different_timings || false,
          weekday_opening_time: formData.weekday_opening_time || "",
          weekday_closing_time: formData.weekday_closing_time || "",
          
          // Location fields
          nearest_metro_distance: formData.nearest_metro_distance || 0,
          nearest_bus_distance: formData.nearest_bus_distance || 0,
          nearest_train_distance: formData.nearest_train_distance || 0,
          nearest_airport_distance: formData.nearest_airport_distance || 0,
          nearest_hospital_distance: formData.nearest_hospital_distance || 0,
          
          // Coworking specific fields
          total_center_area: formData.total_center_area || 0,
          total_seating_capacity: formData.total_seating_capacity || 0,
          typical_floorplate_area: formData.typical_floorplate_area || 0,
          building_type_business_park: formData.building_type_business_park || false,
          building_type_independent_commercial_tower: formData.building_type_independent_commercial_tower || false,
          
          // Office rent specific fields
          floor_size: formData.floor_size || 0,
          lock_in: formData.lock_in || 0,
          floors: formData.floors || 0,
          building_grade: formData.building_grade || 0,
          year_built: formData.year_built || 0,
          furnishing_fully_furnished: formData.furnishing_fully_furnished || false,
          furnishing_unfurnished: formData.furnishing_unfurnished || false,
          building_type_business_tower: formData.building_type_business_tower || false,
          building_type_it_ites: formData.building_type_it_ites || false,
          building_type_independent_commercial_tower_office: formData.building_type_independent_commercial_tower_office || false,
          
          // Contact information
          contact_number: formData.contact_number || "",
          email: formData.email || "",
          
          // All amenities
          amenities: {
            "2_wheeler_parking": formData["2_wheeler_parking"] || false,
            "4_wheeler_parking": formData["4_wheeler_parking"] || false,
            "air_conditioners": formData.air_conditioners || false,
            "air_filters": formData.air_filters || false,
            "breakout_recreational_area": formData.breakout_recreational_area || false,
            "bus": formData.bus || false,
            "cafeteria": formData.cafeteria || false,
            "chairs_desks": formData.chairs_desks || false,
            "charging": formData.charging || false,
            "coffee": formData.coffee || false,
            "conference_room": formData.conference_room || false,
            "event_space": formData.event_space || false,
            "fire_extinguisher": formData.fire_extinguisher || false,
            "first_aid_kit": formData.first_aid_kit || false,
            "fitness_centre": formData.fitness_centre || false,
            "indoor_plants": formData.indoor_plants || false,
            "lan": formData.lan || false,
            "library": formData.library || false,
            "lift": formData.lift || false,
            "lounge_area": formData.lounge_area || false,
            "lunch": formData.lunch || false,
            "meeting_rooms": formData.meeting_rooms || false,
            "metro_connectivity": formData.metro_connectivity || false,
            "nearby_eateries": formData.nearby_eateries || false,
            "outdoor_seating": formData.outdoor_seating || false,
            "pantry_area": formData.pantry_area || false,
            "pet_friendly": formData.pet_friendly || false,
            "phone_booth": formData.phone_booth || false,
            "power_backup": formData.power_backup || false,
            "printer": formData.printer || false,
            "rental_cycles_evs": formData.rental_cycles_evs || false,
            "security_personnel": formData.security_personnel || false,
            "separate_washroom": formData.separate_washroom || false,
            "shuttle": formData.shuttle || false,
            "single_washroom": formData.single_washroom || false,
            "smoke_alarms": formData.smoke_alarms || false,
            "snacks_drinks": formData.snacks_drinks || false,
            "stationery": formData.stationery || false,
            "storage_space": formData.storage_space || false,
            "tea": formData.tea || false,
            "training_room": formData.training_room || false,
            "washroom_near_premise": formData.washroom_near_premise || false,
            "water": formData.water || false,
            "wellness_centre": formData.wellness_centre || false,
            "wifi": formData.wifi || false,
          },
          
          // Images
          images: imageUrls,
        }
      }

      console.log("Saving property to Firestore...")
      
      // Ensure all fields have proper values before sending to Firestore
      if (!propertyData.propertyDetails.city) propertyData.propertyDetails.city = "Unknown"
      if (propertyData.propertyDetails.total_weekly_hours === undefined) propertyData.propertyDetails.total_weekly_hours = 0
      if (propertyData.propertyDetails.days_open_per_week === undefined) propertyData.propertyDetails.days_open_per_week = 0
      if (propertyData.propertyDetails.has_different_timings === undefined) propertyData.propertyDetails.has_different_timings = false
      if (!propertyData.propertyDetails.weekday_opening_time) propertyData.propertyDetails.weekday_opening_time = ""
      if (!propertyData.propertyDetails.weekday_closing_time) propertyData.propertyDetails.weekday_closing_time = ""
      if (propertyData.propertyDetails.nearest_metro_distance === undefined) propertyData.propertyDetails.nearest_metro_distance = 0
      if (propertyData.propertyDetails.nearest_bus_distance === undefined) propertyData.propertyDetails.nearest_bus_distance = 0
      if (propertyData.propertyDetails.nearest_train_distance === undefined) propertyData.propertyDetails.nearest_train_distance = 0
      if (propertyData.propertyDetails.nearest_airport_distance === undefined) propertyData.propertyDetails.nearest_airport_distance = 0
      if (propertyData.propertyDetails.nearest_hospital_distance === undefined) propertyData.propertyDetails.nearest_hospital_distance = 0
      if (propertyData.propertyDetails.total_center_area === undefined) propertyData.propertyDetails.total_center_area = 0
      if (propertyData.propertyDetails.total_seating_capacity === undefined) propertyData.propertyDetails.total_seating_capacity = 0
      if (propertyData.propertyDetails.typical_floorplate_area === undefined) propertyData.propertyDetails.typical_floorplate_area = 0
      if (propertyData.propertyDetails.building_type_business_park === undefined) propertyData.propertyDetails.building_type_business_park = false
      if (propertyData.propertyDetails.building_type_independent_commercial_tower === undefined) propertyData.propertyDetails.building_type_independent_commercial_tower = false
      if (propertyData.propertyDetails.floor_size === undefined) propertyData.propertyDetails.floor_size = 0
      if (propertyData.propertyDetails.lock_in === undefined) propertyData.propertyDetails.lock_in = 0
      if (propertyData.propertyDetails.floors === undefined) propertyData.propertyDetails.floors = 0
      if (propertyData.propertyDetails.building_grade === undefined) propertyData.propertyDetails.building_grade = 0
      if (propertyData.propertyDetails.year_built === undefined) propertyData.propertyDetails.year_built = 0
      if (propertyData.propertyDetails.furnishing_fully_furnished === undefined) propertyData.propertyDetails.furnishing_fully_furnished = false
      if (propertyData.propertyDetails.furnishing_unfurnished === undefined) propertyData.propertyDetails.furnishing_unfurnished = false
      if (propertyData.propertyDetails.building_type_business_tower === undefined) propertyData.propertyDetails.building_type_business_tower = false
      if (propertyData.propertyDetails.building_type_it_ites === undefined) propertyData.propertyDetails.building_type_it_ites = false
      if (propertyData.propertyDetails.building_type_independent_commercial_tower_office === undefined) propertyData.propertyDetails.building_type_independent_commercial_tower_office = false
      if (!propertyData.propertyDetails.contact_number) propertyData.propertyDetails.contact_number = ""
      if (!propertyData.propertyDetails.email) propertyData.propertyDetails.email = ""
      
      console.log("Validated property data:", propertyData)
      
      // Save to Firestore
      const propertyId = await propertyService.createProperty(propertyData)
      
      console.log("Property saved successfully with ID:", propertyId)
      
      toast({
        title: "Property Uploaded Successfully",
        description: "Your property has been listed on the marketplace",
      })
      
      // Reset form
      setFormData(initialFormData)
      setPredictedPrice(null)
      setHasPrediction(false)
      
      // Redirect to success page
      router.push("/sellers/success")
    } catch (error: any) {
      console.error("Upload error:", error)
      
      const errorMessage = error?.message || error?.toString() || "Unknown error occurred"
      setError(errorMessage)
      
      toast({
        title: "Upload Failed",
        description: `Failed to upload property: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      console.log("Upload process completed, resetting loading state")
      setIsSubmitting(false)
    }
  }

  const renderPropertyTypeFields = () => {
    if (formData.propertyType.startsWith("coworking")) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="total_center_area">Total Center Area (sq ft)</Label>
            <Input
              id="total_center_area"
              type="number"
              value={formData.total_center_area || ""}
              onChange={(e) => handleInputChange("total_center_area", parseFloat(e.target.value) || 0)}
              placeholder="e.g., 50000"
            />
          </div>
          <div>
            <Label htmlFor="total_seating_capacity">Total Seating Capacity</Label>
            <Input
              id="total_seating_capacity"
              type="number"
              value={formData.total_seating_capacity || ""}
              onChange={(e) => handleInputChange("total_seating_capacity", parseFloat(e.target.value) || 0)}
              placeholder="e.g., 1000"
            />
          </div>
          <div>
            <Label htmlFor="typical_floorplate_area">Typical Floorplate Area (sq ft)</Label>
            <Input
              id="typical_floorplate_area"
              type="number"
              value={formData.typical_floorplate_area || ""}
              onChange={(e) => handleInputChange("typical_floorplate_area", parseFloat(e.target.value) || 0)}
              placeholder="e.g., 10000"
            />
          </div>
          <div>
            <Label>Building Type</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="building_type_business_park"
                  name="coworking_building_type"
                  checked={formData.building_type_business_park || false}
                  onChange={() => handleRadioChange("building_type_business_park", "business_park")}
                  className="h-4 w-4"
                />
                <Label htmlFor="building_type_business_park" className="text-sm font-normal">Business Park</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="building_type_independent_commercial_tower"
                  name="coworking_building_type"
                  checked={formData.building_type_independent_commercial_tower || false}
                  onChange={() => handleRadioChange("building_type_independent_commercial_tower", "independent_commercial_tower")}
                  className="h-4 w-4"
                />
                <Label htmlFor="building_type_independent_commercial_tower" className="text-sm font-normal">Independent Commercial Tower</Label>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (formData.propertyType === "office_rent") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="floor_size">Floor Size (sq ft)</Label>
            <Input
              id="floor_size"
              type="number"
              value={formData.floor_size || ""}
              onChange={(e) => handleInputChange("floor_size", parseFloat(e.target.value) || 0)}
              placeholder="e.g., 5000"
            />
          </div>
          <div>
            <Label htmlFor="lock_in">Lock-in Period (months)</Label>
            <Input
              id="lock_in"
              type="number"
              value={formData.lock_in || ""}
              onChange={(e) => handleInputChange("lock_in", parseFloat(e.target.value) || 0)}
              placeholder="e.g., 36"
            />
          </div>
          <div>
            <Label htmlFor="floors">Number of Floors</Label>
            <Input
              id="floors"
              type="number"
              value={formData.floors || ""}
              onChange={(e) => handleInputChange("floors", parseFloat(e.target.value) || 0)}
              placeholder="e.g., 10"
            />
          </div>
          <div>
            <Label htmlFor="building_grade">Building Grade</Label>
            <Input
              id="building_grade"
              type="number"
              value={formData.building_grade || ""}
              onChange={(e) => handleInputChange("building_grade", parseFloat(e.target.value) || 0)}
              placeholder="e.g., 1.0"
            />
          </div>
          <div>
            <Label htmlFor="year_built">Year Built</Label>
            <Input
              id="year_built"
              type="number"
              value={formData.year_built || ""}
              onChange={(e) => handleInputChange("year_built", parseFloat(e.target.value) || 0)}
              placeholder="e.g., 2015"
            />
          </div>
          <div>
            <Label>Furnishing</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="furnishing_fully_furnished"
                  name="furnishing"
                  checked={formData.furnishing_fully_furnished || false}
                  onChange={() => handleRadioChange("furnishing_fully_furnished", "fully_furnished")}
                  className="h-4 w-4"
                />
                <Label htmlFor="furnishing_fully_furnished" className="text-sm font-normal">Fully Furnished</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="furnishing_unfurnished"
                  name="furnishing"
                  checked={formData.furnishing_unfurnished || false}
                  onChange={() => handleRadioChange("furnishing_unfurnished", "unfurnished")}
                  className="h-4 w-4"
                />
                <Label htmlFor="furnishing_unfurnished" className="text-sm font-normal">Unfurnished</Label>
              </div>
            </div>
          </div>
          <div>
            <Label>Building Type</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="building_type_business_tower"
                  name="office_building_type"
                  checked={formData.building_type_business_tower || false}
                  onChange={() => handleRadioChange("building_type_business_tower", "business_tower")}
                  className="h-4 w-4"
                />
                <Label htmlFor="building_type_business_tower" className="text-sm font-normal">Business Tower</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="building_type_it_ites"
                  name="office_building_type"
                  checked={formData.building_type_it_ites || false}
                  onChange={() => handleRadioChange("building_type_it_ites", "it_ites")}
                  className="h-4 w-4"
                />
                <Label htmlFor="building_type_it_ites" className="text-sm font-normal">IT/ITeS Building</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="building_type_independent_commercial_tower_office"
                  name="office_building_type"
                  checked={formData.building_type_independent_commercial_tower_office || false}
                  onChange={() => handleRadioChange("building_type_independent_commercial_tower_office", "independent_commercial_tower")}
                  className="h-4 w-4"
                />
                <Label htmlFor="building_type_independent_commercial_tower_office" className="text-sm font-normal">Independent Commercial Tower</Label>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Property Details</TabsTrigger>
              <TabsTrigger value="prediction">Price Prediction</TabsTrigger>
              <TabsTrigger value="upload">Upload Property</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Property Information
                  </CardTitle>
                  <CardDescription>
                    Fill in the details about your property to get an accurate price prediction
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Property Type Selection */}
                  <div>
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => handleInputChange("propertyType", value)}
                    >
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                        </SelectContent>
                      </Select>
                  </div>

                  {/* City Selection */}
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => handleInputChange("city", value)}
                    >
                          <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                        <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                          </SelectItem>
                        ))}
                        </SelectContent>
                      </Select>
                  </div>

                  {/* Property Type Specific Fields */}
                  {formData.propertyType && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Property Specifications</h3>
                        {renderPropertyTypeFields()}
                      </div>
                    </>
                  )}

                  {/* Operating Hours */}
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Operating Hours</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="total_weekly_hours">Total Weekly Hours</Label>
                        <Input
                          id="total_weekly_hours"
                          type="number"
                          value={formData.total_weekly_hours || ""}
                          onChange={(e) => handleInputChange("total_weekly_hours", parseFloat(e.target.value) || 0)}
                          placeholder="e.g., 168"
                        />
                      </div>
                      <div>
                        <Label htmlFor="days_open_per_week">Days Open Per Week</Label>
                        <Input
                          id="days_open_per_week"
                          type="number"
                          value={formData.days_open_per_week || ""}
                          onChange={(e) => handleInputChange("days_open_per_week", parseFloat(e.target.value) || 0)}
                          placeholder="e.g., 7"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_different_timings"
                          checked={formData.has_different_timings}
                          onCheckedChange={(checked) => handleCheckboxChange("has_different_timings", checked as boolean)}
                        />
                        <Label htmlFor="has_different_timings">Different Timings</Label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="weekday_opening_time">Opening Time</Label>
                        <Input
                          id="weekday_opening_time"
                          type="time"
                          value={formData.weekday_opening_time}
                          onChange={(e) => handleInputChange("weekday_opening_time", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="weekday_closing_time">Closing Time</Label>
                        <Input
                          id="weekday_closing_time"
                          type="time"
                          value={formData.weekday_closing_time}
                          onChange={(e) => handleInputChange("weekday_closing_time", e.target.value)}
                        />
                      </div>
                    </div>
              </div>

                  {/* Location Information */}
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Location Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nearest_metro_distance">Nearest Metro Distance (km)</Label>
                        <Input
                          id="nearest_metro_distance"
                          type="number"
                          step="0.1"
                          value={formData.nearest_metro_distance || ""}
                          onChange={(e) => handleInputChange("nearest_metro_distance", parseFloat(e.target.value) || 0)}
                          placeholder="e.g., 2.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nearest_bus_distance">Nearest Bus Distance (km)</Label>
                        <Input
                          id="nearest_bus_distance"
                          type="number"
                          step="0.1"
                          value={formData.nearest_bus_distance || ""}
                          onChange={(e) => handleInputChange("nearest_bus_distance", parseFloat(e.target.value) || 0)}
                          placeholder="e.g., 1.2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nearest_train_distance">Nearest Train Distance (km)</Label>
                        <Input
                          id="nearest_train_distance"
                          type="number"
                          step="0.1"
                          value={formData.nearest_train_distance || ""}
                          onChange={(e) => handleInputChange("nearest_train_distance", parseFloat(e.target.value) || 0)}
                          placeholder="e.g., 5.0"
                />
              </div>
                      <div>
                        <Label htmlFor="nearest_airport_distance">Nearest Airport Distance (km)</Label>
                        <Input
                          id="nearest_airport_distance"
                          type="number"
                          step="0.1"
                          value={formData.nearest_airport_distance || ""}
                          onChange={(e) => handleInputChange("nearest_airport_distance", parseFloat(e.target.value) || 0)}
                          placeholder="e.g., 25.0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nearest_hospital_distance">Nearest Hospital Distance (km)</Label>
                    <Input 
                          id="nearest_hospital_distance"
                      type="number" 
                          step="0.1"
                          value={formData.nearest_hospital_distance || ""}
                          onChange={(e) => handleInputChange("nearest_hospital_distance", parseFloat(e.target.value) || 0)}
                          placeholder="e.g., 3.0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {coworkingAmenities.map((amenity) => (
                        <div key={amenity.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity.id}
                            checked={Boolean(formData[amenity.id as keyof PropertyFormData])}
                            onCheckedChange={(checked) => handleCheckboxChange(amenity.id as keyof PropertyFormData, checked as boolean)}
                          />
                          <Label htmlFor={amenity.id}>{amenity.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Property Images */}
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Property Images (Required for AI Analysis)</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="images">Upload Property Images</Label>
                        <Input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="mt-2"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                          Upload multiple images of your property (min 3, max 10 images). 
                          Our AI will analyze these images along with your property details for accurate price prediction.
                        </p>
              </div>

                      {formData.images.length > 0 && (
                        <div className="mt-4">
                          <Label>Selected Images ({formData.images.length})</Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                            {Array.from(formData.images).map((file, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Property image ${index + 1}`}
                                  className="w-full h-24 object-cover rounded border"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImages = Array.from(formData.images);
                                    newImages.splice(index, 1);
                                    setFormData({ ...formData, images: newImages });
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {formData.images.length < 3 && formData.images.length > 0 && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            ⚠️ Please upload at least 3 images for better AI analysis accuracy.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact_number">Contact Number</Label>
                        <Input
                          id="contact_number"
                          type="tel"
                          value={formData.contact_number}
                          onChange={(e) => handleInputChange("contact_number", e.target.value)}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="contact@example.com"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="description">Property Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Describe your property, its features, and any additional information..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => setActiveTab("prediction")}
                      disabled={!formData.propertyType || !formData.city || formData.images.length < 3}
                    >
                      Next: Get Price Prediction
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prediction" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    AI Price Prediction
                  </CardTitle>
                  <CardDescription>
                    Our advanced AI model will analyze your property details and images using computer vision to provide an accurate price prediction
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {predictedPrice ? (
                    <div className="text-center space-y-4">
                      <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                          <h3 className="text-xl font-semibold text-green-800">Price Prediction Generated</h3>
                        </div>
                        <div className="text-3xl font-bold text-green-600">
                          ₹{predictedPrice.toLocaleString()}
                        </div>
                        <p className="text-green-700">per month</p>
                        <p className="text-sm text-green-600 mt-2">
                          Based on analysis of {formData.images.length} property images and detailed specifications
                        </p>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <Button variant="outline" onClick={() => setActiveTab("details")}>
                          Edit Details
                        </Button>
                        <Button onClick={() => setActiveTab("upload")}>
                          Continue to Upload
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-6">
                      <div className="p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          Ready to Get Your Price Prediction?
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Click the button below to analyze your property details and {formData.images.length} images using AI-powered computer vision for accurate price prediction
                        </p>
                        <Button 
                          onClick={predictPrice} 
                          disabled={isPredicting}
                          size="lg"
                          className="flex items-center gap-2"
                        >
                          {isPredicting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-4 w-4" />
                              Get Price Prediction
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <Button variant="outline" onClick={() => setActiveTab("details")}>
                          Back to Details
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Property
                  </CardTitle>
                  <CardDescription>
                    Add images and finalize your property listing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {predictedPrice ? (
                    <>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-blue-800">Predicted Price: ₹{predictedPrice.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Error Display */}
                      {error && (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <span className="font-semibold text-red-800">Upload Error</span>
                          </div>
                          <p className="text-red-700 text-sm">{error}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setError(null)}
                            className="mt-2"
                          >
                            Dismiss
                          </Button>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="images">Property Images</Label>
                        <Input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="mt-2"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                          Upload multiple images of your property (max 10 images)
                        </p>
                      </div>

                      <div className="flex gap-4 justify-center">
                        <Button variant="outline" onClick={() => setActiveTab("prediction")}>
                          Back to Prediction
                        </Button>
                        <Button 
                          onClick={uploadProperty}
                          disabled={isSubmitting}
                          className="flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              Upload Property
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="p-8 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                          Price Prediction Required
                        </h3>
                        <p className="text-yellow-700 mb-4">
                          You need to get a price prediction before uploading your property
                        </p>
                        <Button onClick={() => setActiveTab("prediction")}>
                          Get Price Prediction
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

