import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import type { Property } from "@/models"

// Get all properties
export async function getAllProperties() {
  try {
    const propertiesRef = collection(db, "properties")
    const q = query(propertiesRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Property[]
  } catch (error) {
    console.error("Error getting properties:", error)
    throw error
  }
}

// Get featured properties
export async function getFeaturedProperties() {
  try {
    const propertiesRef = collection(db, "properties")
    const q = query(
      propertiesRef,
      where("featured", "==", true),
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
      limit(4),
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Property[]
  } catch (error) {
    console.error("Error getting featured properties:", error)
    throw error
  }
}

// Get property by ID
export async function getPropertyById(id: string) {
  try {
    const propertyRef = doc(db, "properties", id)
    const propertyDoc = await getDoc(propertyRef)

    if (!propertyDoc.exists()) {
      throw new Error("Property not found")
    }

    return {
      id: propertyDoc.id,
      ...propertyDoc.data(),
    } as Property
  } catch (error) {
    console.error("Error getting property:", error)
    throw error
  }
}

// Get properties by seller ID
export async function getPropertiesBySellerId(sellerId: string) {
  try {
    const propertiesRef = collection(db, "properties")
    const q = query(propertiesRef, where("sellerId", "==", sellerId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Property[]
  } catch (error) {
    console.error("Error getting seller properties:", error)
    throw error
  }
}

// Create a new property
export async function createProperty(propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">, images: File[]) {
  try {
    // Upload images to Firebase Storage
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const storageRef = ref(storage, `properties/${Date.now()}_${image.name}`)
        await uploadBytes(storageRef, image)
        return getDownloadURL(storageRef)
      }),
    )

    // Add property to Firestore
    const propertyRef = await addDoc(collection(db, "properties"), {
      ...propertyData,
      images: imageUrls,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return propertyRef.id
  } catch (error) {
    console.error("Error creating property:", error)
    throw error
  }
}

// Update a property
export async function updateProperty(id: string, propertyData: Partial<Property>, newImages?: File[]) {
  try {
    const propertyRef = doc(db, "properties", id)

    let imageUrls = propertyData.images || []

    // Upload new images if provided
    if (newImages && newImages.length > 0) {
      const newImageUrls = await Promise.all(
        newImages.map(async (image) => {
          const storageRef = ref(storage, `properties/${Date.now()}_${image.name}`)
          await uploadBytes(storageRef, image)
          return getDownloadURL(storageRef)
        }),
      )

      imageUrls = [...imageUrls, ...newImageUrls]
    }

    await updateDoc(propertyRef, {
      ...propertyData,
      images: imageUrls,
      updatedAt: serverTimestamp(),
    })

    return id
  } catch (error) {
    console.error("Error updating property:", error)
    throw error
  }
}

// Delete a property
export async function deleteProperty(id: string) {
  try {
    const propertyRef = doc(db, "properties", id)
    await deleteDoc(propertyRef)
    return id
  } catch (error) {
    console.error("Error deleting property:", error)
    throw error
  }
}

