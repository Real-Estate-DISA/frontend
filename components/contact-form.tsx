"use client"

import type React from "react"

import { useState } from "react"
import { MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface ContactFormProps {
  sellerId: string
}

export default function ContactForm({ sellerId }: ContactFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Message sent",
        description: "The seller will get back to you soon.",
      })

      // Reset form
      e.currentTarget.reset()
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Contact Seller
        </h3>
        <p className="text-sm text-muted-foreground">Interested in this property? Send a message to the seller.</p>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Input placeholder="Your Name" required />
          </div>
          <div className="space-y-1">
            <Input type="email" placeholder="Your Email" required />
          </div>
        </div>
        <div className="space-y-1">
          <Input type="tel" placeholder="Your Phone" />
        </div>
        <div className="space-y-1">
          <Textarea
            placeholder="I'm interested in this property. Please contact me with more information."
            className="min-h-[100px]"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By submitting this form, you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  )
}

