import { collection, doc, getDocs, addDoc, updateDoc, query, where, orderBy, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Message } from "@/models"

// Get user messages
export async function getUserMessages(userId: string) {
  try {
    const messagesRef = collection(db, "messages")
    const q = query(messagesRef, where("receiverId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[]
  } catch (error) {
    console.error("Error getting user messages:", error)
    throw error
  }
}

// Get conversation between two users
export async function getConversation(userId1: string, userId2: string) {
  try {
    const messagesRef = collection(db, "messages")
    const q1 = query(messagesRef, where("senderId", "==", userId1), where("receiverId", "==", userId2))
    const q2 = query(messagesRef, where("senderId", "==", userId2), where("receiverId", "==", userId1))

    const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)])

    const messages1 = snapshot1.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    const messages2 = snapshot2.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return [...messages1, ...messages2].sort((a: any, b: any) => a.createdAt - b.createdAt) as Message[]
  } catch (error) {
    console.error("Error getting conversation:", error)
    throw error
  }
}

// Send a message
export async function sendMessage(senderId: string, receiverId: string, content: string, propertyId?: string) {
  try {
    const messageRef = await addDoc(collection(db, "messages"), {
      senderId,
      receiverId,
      propertyId,
      content,
      read: false,
      createdAt: serverTimestamp(),
    })

    return messageRef.id
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

// Mark message as read
export async function markMessageAsRead(messageId: string) {
  try {
    const messageRef = doc(db, "messages", messageId)
    await updateDoc(messageRef, {
      read: true,
    })

    return messageId
  } catch (error) {
    console.error("Error marking message as read:", error)
    throw error
  }
}

