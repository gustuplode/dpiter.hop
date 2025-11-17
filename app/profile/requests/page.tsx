import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
import { ArrowLeft, Package, ExternalLink, Clock, CheckCircle2 } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function UserRequestsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/request-product")
  }

  const { data: requests } = await supabase
    .from("product_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const pendingRequests = requests?.filter(r => r.status === 'pending') || []
  const approvedRequests = requests?.filter(r => r.status === 'approved') || []

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-4 sticky top-0 z-10">
        <div className="container mx-auto max-w-3xl flex items-center gap-4">
          <Link href="/profile" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">My Product Requests</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track your requested products
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 py-8 space-y-8">
        {/* Pending Requests */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Pending Requests
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {pendingRequests.length} request{pendingRequests.length !== 1 ? 's' : ''} awaiting approval
              </p>
            </div>
          </div>

          {pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-md overflow-hidden">
                  <div className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={request.image_url || "/placeholder.svg"}
                        alt="Product Request"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        {request.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-3">
                            {request.description}
                          </p>
                        )}
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Submitted {new Date(request.created_at).toLocaleDateString()}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-full">
                          <Clock className="h-3 w-3" />
                          Processing
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
              <p className="text-slate-500 dark:text-slate-400">No pending requests</p>
            </div>
          )}
        </div>

        {/* Approved Requests */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Approved Requests
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {approvedRequests.length} product{approvedRequests.length !== 1 ? 's' : ''} listed
              </p>
            </div>
          </div>

          {approvedRequests.length > 0 ? (
            <div className="space-y-4">
              {approvedRequests.map((request) => (
                <div key={request.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-md overflow-hidden">
                  <div className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={request.image_url || "/placeholder.svg"}
                        alt="Product Request"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        {request.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                            {request.description}
                          </p>
                        )}
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                          Approved {new Date(request.updated_at || request.created_at).toLocaleDateString()}
                        </p>
                        {request.product_link && (
                          <a
                            href={request.product_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            View Product
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
              <p className="text-slate-500 dark:text-slate-400 mb-4">No approved requests yet</p>
              <Link href="/request-product">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Package className="h-4 w-4 mr-2" />
                  Request New Product
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
