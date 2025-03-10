import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"

const sampleProperties = [
  {
    title: "Modern Apartment in Downtown",
    location: "ny",
    price: 450000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    type: "apartment",
    featured: true,
    createdAt: new Date(),
    userId: "system",
    description: "Beautiful modern apartment in the heart of downtown with amazing city views.",
  },
  {
    title: "Spacious Family Home",
    location: "ca",
    price: 750000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    type: "house",
    featured: true,
    createdAt: new Date(),
    userId: "system",
    description: "Perfect family home with large backyard and modern amenities.",
  },
  {
    title: "Luxury Beachfront Condo",
    location: "fl",
    price: 1200000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    type: "condo",
    featured: true,
    createdAt: new Date(),
    userId: "system",
    description: "Stunning beachfront condo with panoramic ocean views.",
  },
  {
    title: "Charming Townhouse",
    location: "tx",
    price: 350000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
    type: "townhouse",
    featured: false,
    createdAt: new Date(),
    userId: "system",
    description: "Beautiful townhouse in a quiet neighborhood with great amenities.",
  },
  {
    title: "Urban Studio Apartment",
    location: "il",
    price: 250000,
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    type: "apartment",
    featured: false,
    createdAt: new Date(),
    userId: "system",
    description: "Cozy studio apartment perfect for young professionals.",
  },
]

export async function seedProperties() {
  try {
    const propertiesRef = collection(db, "properties")
    
    for (const property of sampleProperties) {
      await addDoc(propertiesRef, property)
      console.log(`Added property: ${property.title}`)
    }
    
    console.log("Successfully seeded properties!")
  } catch (error) {
    console.error("Error seeding properties:", error)
  }
} 