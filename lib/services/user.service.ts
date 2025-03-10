import { collection, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../firebase'

export interface User {
  id: string
  email: string
  name: string
  role: 'buyer' | 'seller'
  createdAt: Date
  favorites: string[]
}

export const userService = {
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'favorites'>) {
    try {
      const user = auth.currentUser
      if (!user) throw new Error('No authenticated user')

      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        createdAt: new Date(),
        favorites: []
      })

      return user.uid
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = auth.currentUser
      if (!user) return null

      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as User
      }
      return null
    } catch (error) {
      console.error('Error getting current user:', error)
      throw error
    }
  },

  async addToFavorites(propertyId: string) {
    try {
      const user = auth.currentUser
      if (!user) throw new Error('No authenticated user')

      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const favorites = userData.favorites || []
        
        if (!favorites.includes(propertyId)) {
          await setDoc(userRef, {
            ...userData,
            favorites: [...favorites, propertyId]
          })
        }
      }
    } catch (error) {
      console.error('Error adding to favorites:', error)
      throw error
    }
  },

  async removeFromFavorites(propertyId: string) {
    try {
      const user = auth.currentUser
      if (!user) throw new Error('No authenticated user')

      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const favorites = userData.favorites || []
        
        await setDoc(userRef, {
          ...userData,
          favorites: favorites.filter((id: string) => id !== propertyId)
        })
      }
    } catch (error) {
      console.error('Error removing from favorites:', error)
      throw error
    }
  },

  async updateUser(userId: string, userData: Partial<User>) {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }
} 