"use client";
import React from 'react';
import { useState } from 'react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  Mail, 
  Briefcase, 
  Image, 
  BookOpen, 
  Send, 
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Moon,
  Sun,
  LinkedinIcon,
} from 'lucide-react';
import Link from 'next/link';

export default function PortfolioHomepage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`fixed w-full z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              PORTFOLIO
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#projects" className="hover:text-purple-600 transition">Projects</a>
            <a href="#blog" className="hover:text-purple-600 transition">Blog</a>
            <a href="#gallery" className="hover:text-purple-600 transition">Gallery</a>
            <a href="#contact" className="hover:text-purple-600 transition">Contact</a>
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleDarkMode}
              className={`p-2 mr-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={toggleMenu} className="focus:outline-none">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {menuOpen && (
          <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} pt-2 pb-4`}>
            <div className="container mx-auto px-4 flex flex-col space-y-3">
              <a href="#projects" className="py-2 hover:text-purple-600 transition" onClick={toggleMenu}>Projects</a>
              <a href="#blog" className="py-2 hover:text-purple-600 transition" onClick={toggleMenu}>Blog</a>
              <a href="#gallery" className="py-2 hover:text-purple-600 transition" onClick={toggleMenu}>Gallery</a>
              <a href="#contact" className="py-2 hover:text-purple-600 transition" onClick={toggleMenu}>Contact</a>
            </div>
          </div>
        )}
      </header>
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                Hi, I'm <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Alex Morgan</span>
              </h1>
              <p className="text-xl md:text-2xl mb-6 leading-relaxed">
                The <span className="font-bold">world's greatest</span> full-stack developer creating exceptional digital experiences.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <a 
                  href="#projects" 
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full font-medium flex items-center justify-center"
                >
                  View Projects <ArrowRight size={18} className="ml-2" />
                </a>
                <a 
                  href="#contact" 
                  className={`px-6 py-3 ${darkMode ? 'bg-gray-800' : 'bg-white'} border border-purple-500 text-purple-600 rounded-full font-medium flex items-center justify-center`}
                >
                  Contact Me
                </a>
              </div>
              <div className="flex space-x-4 mt-6">
                <a href="https://github.com/Sachet407" className="text-gray-600 hover:text-purple-600 transition">
                  <Github size={22} />
                </a>
                <a href="https://www.linkedin.com/in/sachetkhatiwadaofficial/" className="text-gray-600 hover:text-purple-600 transition">
                  <Linkedin size={22} />
                </a>
            <a href="#" className="text-gray-600 hover:text-purple-600 transition">
                  <Instagram size={22} />
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 md:w-96 md:h-96">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-2 bg-gray-200 rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1492288991661-058aa541ff43?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Projects</h2>
            <p className="text-lg md:w-2/3 mx-auto">Check out some of my best work showcasing my skills and expertise.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div 
                key={item}
                className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} transition duration-300 transform hover:-translate-y-2`}
              >
                <div className="relative h-48 bg-gray-200">
                  <img src={`/api/placeholder/400/240`} alt={`Project ${item}`} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Project Title {item}</h3>
                  <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    A brief description of this amazing project and the technologies used to build it.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">Next.js</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">Tailwind CSS</span>
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">Node.js</span>
                  </div>
                  <a href="#" className="text-purple-600 font-medium flex items-center">
                    View Project <ArrowRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <a href="#" className="px-6 py-3 border border-purple-500 text-purple-600 rounded-full font-medium hover:bg-purple-600 hover:text-white transition">
              View All Projects
            </a>
          </div>
        </div>
      </section>
      
      {/* Blog Section */}
      <section id="blog" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Latest Blog Posts</h2>
            <p className="text-lg md:w-2/3 mx-auto">Insights, tutorials, and thoughts on development and design.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div 
                key={item}
                className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} transition duration-300 transform hover:-translate-y-2`}
              >
                <div className="relative h-48 bg-gray-200">
                  <img src={`/api/placeholder/400/240`} alt={`Blog ${item}`} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>May 1, 2025</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm text-purple-600">Development</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Building Modern Web Applications with Next.js</h3>
                  <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Learn how to leverage the power of Next.js to build scalable and performant web applications.
                  </p>
                  <a href="#" className="text-purple-600 font-medium flex items-center">
                    Read More <ArrowRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <a href="#" className="px-6 py-3 border border-purple-500 text-purple-600 rounded-full font-medium hover:bg-purple-600 hover:text-white transition">
              View All Posts
            </a>
          </div>
        </div>
      </section>
      
      {/* Gallery Section */}
      <section id="gallery" className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Photo Gallery</h2>
            <p className="text-lg md:w-2/3 mx-auto">A visual showcase of my journey, events, and creative moments.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="aspect-square overflow-hidden rounded-lg shadow-md">
                <img 
                  src={`/api/placeholder/300/300`} 
                  alt={`Gallery image ${item}`} 
                  className="w-full h-full object-cover transition duration-300 transform hover:scale-105"
                />
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <a href="#" className="px-6 py-3 border border-purple-500 text-purple-600 rounded-full font-medium hover:bg-purple-600 hover:text-white transition">
              Browse Full Gallery
            </a>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Get In Touch</h2>
            <p className="text-lg md:w-2/3 mx-auto">Have a project in mind or just want to say hello? Feel free to reach out!</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 md:p-8`}>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block mb-2 font-medium">Name</label>
                    <input 
                      type="text" 
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'} border`}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Email</label>
                    <input 
                      type="email" 
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'} border`}
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-medium">Subject</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'} border`}
                    placeholder="Subject"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-medium">Message</label>
                  <textarea 
                    className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'} border`}
                    placeholder="Your message"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center"
                >
                  Send Message <Send size={18} className="ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className={`py-8 ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                PORTFOLIO
              </span>
              <p className="mt-2">© 2025 All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-purple-600 transition">
                <Github size={20} />
              </a>
              <a href="#" className="hover:text-purple-600 transition">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-purple-600 transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-purple-600 transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Login Modal */}
      <div className="fixed bottom-4 right-4">
        <Link
          href="/sign-in" 
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg hover:opacity-90 transition"
        >
          <User size={20} />
        </Link>
      </div>
    </div>
  );
}