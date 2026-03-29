import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img 
                src="/logos/logo2.png" 
                alt="Boult Logo"
                className="h-12 w-auto mb-3"
              />
              <p className="text-xs text-gray-400 font-body">Innovate | Perform | Protect</p>
            </div>
            <p className="text-gray-400 text-sm font-body leading-relaxed">
              V Tech Multi Solutions offers an extensive range of Vehicle Care and Maintenance products under the brand name BOULT.
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6 text-lg">Useful Links</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link to="/" className="font-body hover:text-orange-500 transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="font-body hover:text-orange-500 transition duration-300">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="font-body hover:text-orange-500 transition duration-300">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/cart" className="font-body hover:text-orange-500 transition duration-300">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/account" className="font-body hover:text-orange-500 transition duration-300">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6 text-lg">Contact Us</h4>
            <div className="space-y-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Phone size={16} className="text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 font-semibold">+91 96651 54496</p>
                    <p className="text-gray-500 text-xs">Mon-Fri, 9AM-6PM IST</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail size={16} className="text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 font-semibold">vtechmultisolutions@gmail.com</p>
                    <p className="text-gray-500 text-xs">We reply within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 font-semibold">Office No. 404, Patel Plaza</p>
                    <p className="text-gray-500 text-xs">Miramandal Chowk, Parivati, Pune-411009 Maharashtra</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6 text-lg">Policies</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link to="/privacy-policy" className="hover:text-orange-500 transition duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/return-refund-policy" className="hover:text-orange-500 transition duration-300">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-orange-500 transition duration-300">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-orange-500 transition duration-300">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-orange-500 transition duration-300">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop on Other Platforms */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6 text-lg">Shop on Other Platforms</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a 
                  href="https://www.amazon.in/s?k=boult+india" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-orange-500 transition duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726-1.53.406-3.045.61-4.516.61-2.265 0-4.463-.42-6.588-1.265-2.11-.84-3.98-2.036-5.61-3.59-.147-.138-.178-.273-.096-.434zm23.71-5.1c-.315-.196-.57-.348-.767-.46-.63-.353-1.244-.71-1.846-1.066-.674-.4-1.204-.747-1.592-1.04-.39-.294-.577-.59-.577-.89 0-.3.187-.596.577-.89.388-.293.918-.64 1.592-1.04.602-.356 1.216-.713 1.846-1.066.197-.112.452-.264.767-.46.316-.196.526-.196.63 0 .106.196.03.436-.226.72-.256.284-.526.568-.81.852-.285.284-.526.568-.726.852-.2.284-.3.568-.3.852s.1.568.3.852c.2.284.44.568.726.852.284.284.554.568.81.852.256.284.332.524.226.72-.104.196-.314.196-.63 0z"/>
                  </svg>
                  Amazon
                </a>
              </li>
              <li>
                <a 
                  href="https://www.flipkart.com/search?q=boult+india" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-orange-500 transition duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.833 0C1.718 0 0 1.718 0 3.833v16.334C0 22.282 1.718 24 3.833 24h16.334C22.282 24 24 22.282 24 20.167V3.833C24 1.718 22.282 0 20.167 0H3.833zm8.797 5.953c.93 0 1.685.755 1.685 1.685s-.755 1.685-1.685 1.685-1.685-.755-1.685-1.685.755-1.685 1.685-1.685zm-5.39 2.247h2.247v9.6H7.24v-9.6zm8.797 0h2.247v9.6h-2.247v-9.6z"/>
                  </svg>
                  Flipkart
                </a>
              </li>
              <li>
                <a 
                  href="https://www.meesho.com/boult-india/pl/3rvqp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-orange-500 transition duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                  </svg>
                  Meesho
                </a>
              </li>
              <li>
                <a 
                  href="https://www.indiamart.com/boult-india/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-orange-500 transition duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                  IndiaMART
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="flex items-center gap-2 hover:text-orange-500 transition duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  Become a Distributor
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section - Social Media Only */}
        <div className="flex justify-center items-center gap-6">
          {/* Social Media */}
          <div className="flex gap-4">
            <a href="https://www.instagram.com/boultindia" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-orange-600 text-white p-2 transition duration-300">
              <Instagram size={18} />
            </a>
            <a href="https://www.linkedin.com/in/boultindia" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-orange-600 text-white p-2 transition duration-300">
              <Linkedin size={18} />
            </a>
            <a href="https://www.youtube.com/@Boultindia" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-orange-600 text-white p-2 transition duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Image */}
      <div className="bg-black py-4 text-center">
        <img 
          src="/img18-2-2-1.png" 
          alt="Boult India"
          className="mx-auto max-h-16 w-auto object-contain"
        />
      </div>

      {/* Copyright - Centered with Hyperlink */}
      <div className="bg-gray-900 py-4 text-center">
        <p className="text-gray-400 text-sm font-body">
          Copyright © 2026 Boult India. Design & Developed By{' '}
          <a 
            href="https://xtendonline.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-400 transition duration-300 font-semibold"
          >
            Xtend Online Media Pvt Ltd
          </a>
        </p>
      </div>

      {/* Back to Top Button - At Very Bottom */}
      <div className="bg-black py-4 text-center border-t border-gray-800">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-gray-400 hover:text-orange-500 transition text-sm font-body font-semibold"
        >
          ↑ Back to Top
        </button>
      </div>
    </footer>
  );
}
