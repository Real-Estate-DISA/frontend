import { collection, doc, getDocs, addDoc, deleteDoc, query, where, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Favorite } from "@/models"

// Get user favorites
export async function getUserFavorites(userId: string) {
  try {
    const favoritesRef = collection(db, "favorites")
    const q = query(favoritesRef, where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Favorite[]
  } catch (error) {
    console.error("Error getting user favorites:", error)
    throw error
  }
}

// Check if property is favorited
export async function isPropertyFavorited(userId: string, propertyId: string) {
  try {
    const favoritesRef = collection(db, "favorites")
    const q = query(favoritesRef, where("userId", "==", userId), where("propertyId", "==", propertyId))
    const querySnapshot = await getDocs(q)

    return !querySnapshot.empty
  } catch (error) {
    console.error("Error checking if property is favorited:", error)
    throw error
  }
}

// Add property to favorites
export async function addToFavorites(userId: string, propertyId: string) {
  try {
    // Check if already favorited
    const isFavorited = await isPropertyFavorited(userId, propertyId)
    if (isFavorited) {
      return null
    }

    const favoriteRef = await addDoc(collection(db, "favorites"), {
      userId,
      propertyId,
      createdAt: serverTimestamp(),
    })

    return favoriteRef.id
  } catch (error) {
    console.error("Error adding to favorites:", error)
    throw error
  }
}

// Remove property from favorites
export async function removeFromFavorites(userId: string, propertyId: string) {
  try {
    const favoritesRef = collection(db, "favorites")
    const q = query(favoritesRef, where("userId", "==", userId), where("propertyId", "==", propertyId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const favoriteDoc = querySnapshot.docs[0]
    await deleteDoc(doc(db, "favorites", favoriteDoc.id))

    return favoriteDoc.id
  } catch (error) {
    console.error("Error removing from favorites:", error)
    throw error
  }
}

