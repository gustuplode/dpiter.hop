import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About DPITER.shop | Curated Fashion Discovery Platform",
  description: "Learn about DPITER.shop - Your trusted fashion discovery platform featuring curated collections from Amazon, Flipkart, Meesho, Myntra & eBay. Safe redirect, no payment processing.",
  keywords: "about dpiter, dpiter shop story, curated fashion platform, fashion discovery, amazon flipkart meesho, dpiter mission, dpiter vision, fashion curation, online shopping guide, dpiter collections, dpiter products",
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">About DPITER.shop</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">What is DPITER.shop?</h2>
            <p>
              <strong><a href="https://dpiter.shop" className="text-primary hover:underline">DPITER.shop</a></strong> is a curated fashion platform that lists trending products from <strong><a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a></strong> and <strong><a href="https://www.ebay.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">eBay</a></strong>. We do not sell any product directly — clicking any item redirects you safely to the official trusted marketplace.
            </p>
            <p>
              Our team curates top trending outfits, premium boys clothing, menswear essentials, and popular styles updated daily at <a href="https://dpiter.shop/search" className="text-primary hover:underline">dpiter.shop/search</a>. DPITER.shop is created to help users find the best items without searching across multiple platforms. Browse our complete <a href="https://dpiter.shop/sitemap.xml" className="text-primary hover:underline">product catalog</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">100% Safe & Secure</h2>
            <p>
              <strong>DPITER.shop does NOT collect any payments.</strong> All purchases happen on verified marketplace platforms like Amazon, Flipkart, Meesho, Myntra, and eBay. We simply help you discover the best fashion picks - your payment and order are processed securely by the trusted marketplace you choose.
            </p>
            <p>
              This means your financial information is protected by world-class security from Amazon, Flipkart, and other trusted retailers. We only provide curated fashion discovery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">How DPITER.shop Works</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Browse curated collections</strong> - We handpick trending fashion from top marketplaces</li>
              <li><strong>Click to view details</strong> - See product information and pricing</li>
              <li><strong>Redirect to trusted marketplace</strong> - You're safely redirected to Amazon, Flipkart, Meesho, Myntra or eBay</li>
              <li><strong>Complete your purchase</strong> - Buy securely from the verified marketplace</li>
            </ol>
            <p className="mt-4">
              DPITER.shop earns a small commission when you make a purchase through our links, at no extra cost to you. This helps us keep the platform running and continue curating the best fashion picks daily.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Why Choose DPITER.shop?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Curated selections</strong> - Only trending, high-quality products from Amazon, Flipkart, Meesho, Myntra & eBay</li>
              <li><strong>Compare across marketplaces</strong> - Find the best price and style without visiting multiple sites</li>
              <li><strong>Updated daily</strong> - Fresh collections added every day</li>
              <li><strong>100% secure</strong> - All purchases through verified marketplace platforms</li>
              <li><strong>No hidden charges</strong> - Prices shown are from the original marketplace</li>
              <li><strong>Wishlist & ratings</strong> - Save favorites and see community reviews</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Our Mission</h2>
            <p>
              At DPITER.shop, we believe shopping should be simple and enjoyable. Instead of browsing endless listings across Amazon, Flipkart, Meesho, and Myntra separately, we bring the best trending fashion to one place.
            </p>
            <p>
              We're passionate about helping you discover styles that match your personality and budget - whether it's premium menswear, trendy boys clothing, or the latest fashion collections.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Explore Our Platform</h2>
            <p className="mb-3">Discover everything <a href="https://dpiter.shop" className="text-primary hover:underline"><strong>DPITER.shop</strong></a> has to offer:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><a href="https://dpiter.shop" className="text-primary hover:underline">Homepage</a> - Latest trending collections</li>
              <li><a href="https://dpiter.shop/search" className="text-primary hover:underline">Search Page</a> - Browse all fashion collections</li>
              <li><a href="https://dpiter.shop/wishlist" className="text-primary hover:underline">Wishlist</a> - Save your favorite products</li>
              <li><a href="https://dpiter.shop/profile" className="text-primary hover:underline">Profile</a> - Manage your account</li>
              <li><a href="https://dpiter.shop/faq" className="text-primary hover:underline">FAQ</a> - Common questions answered</li>
              <li><a href="https://dpiter.shop/contact" className="text-primary hover:underline">Contact</a> - Get in touch with us</li>
              <li><a href="https://dpiter.shop/sitemap.xml" className="text-primary hover:underline">Sitemap</a> - Complete list of all products and collections</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Trusted Marketplace Partners</h2>
            <p>All products on <a href="https://dpiter.shop" className="text-primary hover:underline">DPITER.shop</a> redirect to these verified platforms:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong><a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a></strong> - World's largest online marketplace</li>
              <li><strong><a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a></strong> - India's leading ecommerce platform</li>
              <li><strong><a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a></strong> - Popular budget-friendly fashion destination</li>
              <li><strong><a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a></strong> - India's #1 fashion marketplace</li>
              <li><strong><a href="https://www.ebay.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">eBay</a></strong> - Global marketplace with unique finds</li>
            </ul>
          </section>
        </div>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
