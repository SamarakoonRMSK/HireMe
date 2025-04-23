import React from 'react'

export default function Footer() {
  return (
    <footer class="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-12">
    <div class="container mx-auto px-6">
     
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
        <div class="text-center md:text-left">
          <h2 class="text-2xl font-bold mb-4">HireMe</h2>
          <p class="text-sm opacity-80 mb-6">Innovating the future, one step at a time.</p>
          <div class="flex justify-center md:justify-start space-x-4">
            <a href="#" class="text-white hover:text-yellow-300 transition duration-300">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="text-white hover:text-yellow-300 transition duration-300">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="text-white hover:text-yellow-300 transition duration-300">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="text-white hover:text-yellow-300 transition duration-300">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        
        <div class="text-center md:text-left">
          <h3 class="text-xl font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li><a href="#" class="hover:text-yellow-300 transition duration-300">Home</a></li>
            <li><a href="#" class="hover:text-yellow-300 transition duration-300">About Us</a></li>
            <li><a href="#" class="hover:text-yellow-300 transition duration-300">Services</a></li>
            <li><a href="#" class="hover:text-yellow-300 transition duration-300">Portfolio</a></li>
            <li><a href="#" class="hover:text-yellow-300 transition duration-300">Contact</a></li>
          </ul>
        </div>

      
        <div class="text-center md:text-left">
          <h3 class="text-xl font-semibold mb-4">Subscribe to Our Newsletter</h3>
          <form class="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              class="px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 text-black"
              required
            />
            <button
              type="submit"
              class="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition duration-300"
            >
              Subscribe
            </button>
          </form>
          <p class="text-sm opacity-80 mt-4">Stay updated with our latest news and offers.</p>
        </div>
      </div>

      
      <div class="border-t border-white/10 mt-8 pt-8 text-center">
        <p class="text-sm opacity-80">&copy; 2025 HireMe. All rights reserved.</p>
      </div>
    </div>
  </footer>
  )
}
