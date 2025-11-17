"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, X, ExternalLink, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProductRequest {
  id: string
  user_id: string
  image_url: string
  description: string | null
  status: string
  product_link: string | null
  created_at: string
}

interface RequestListProps {
  initialRequests: ProductRequest[]
}

export function RequestList({ initialRequests }: RequestListProps) {
  const router = useRouter()
  const supabase = createClient()
  const [requests, setRequests] = useState(initialRequests)
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(null)
  const [productLink, setProductLink] = useState("")
  const [sending, setSending] = useState(false)

  const handleSendLink = async (requestId: string) => {
    if (!productLink) {
      alert('Please enter a product link')
      return
    }

    setSending(true)

    try {
      const { error } = await supabase
        .from('product_requests')
        .update({
          product_link: productLink,
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)

      if (error) throw error

      alert('Link sent to user successfully!')
      setSelectedRequest(null)
      setProductLink("")
      router.refresh()
    } catch (error) {
      console.error('Error sending link:', error)
      alert('Failed to send link. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const approvedRequests = requests.filter(r => r.status === 'approved')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#333333] dark:text-[#E5E7EB] mb-4">
          Pending Requests ({pendingRequests.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingRequests.map((request) => (
            <div key={request.id} className="bg-white dark:bg-[#2a2a2e] rounded-lg p-4 shadow-sm">
              <img
                src={request.image_url || "/placeholder.svg"}
                alt="Product Request"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              {request.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-3">
                  {request.description}
                </p>
              )}
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                {new Date(request.created_at).toLocaleDateString()}
              </p>
              <Button
                onClick={() => {
                  setSelectedRequest(request)
                  setProductLink(request.product_link || "")
                }}
                className="w-full bg-[#4A90E2] hover:bg-[#357ABD]"
              >
                Add Product Link
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#333333] dark:text-[#E5E7EB] mb-4">
          Approved Requests ({approvedRequests.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvedRequests.map((request) => (
            <div key={request.id} className="bg-white dark:bg-[#2a2a2e] rounded-lg p-4 shadow-sm opacity-60">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-600">Approved</span>
              </div>
              <img
                src={request.image_url || "/placeholder.svg"}
                alt="Product Request"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              {request.product_link && (
                <a
                  href={request.product_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  View Product <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#2a2a2e] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-[#333333] dark:text-[#E5E7EB] mb-4">
              Add Product Link
            </h3>
            <img
              src={selectedRequest.image_url || "/placeholder.svg"}
              alt="Product"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            {selectedRequest.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {selectedRequest.description}
              </p>
            )}
            <Input
              placeholder="Enter product link (e.g., https://example.com/product)"
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
              className="mb-4"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => handleSendLink(selectedRequest.id)}
                disabled={sending}
                className="flex-1 bg-[#4A90E2] hover:bg-[#357ABD]"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send to User'
                )}
              </Button>
              <Button
                onClick={() => {
                  setSelectedRequest(null)
                  setProductLink("")
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
