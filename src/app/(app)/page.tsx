"use client"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import BlogList from '../components/BlogList';
import ContactForm from '../components/ContactForm';
import GalleryPage from '../components/GalleryPage';
import ProjectsShowcase from '../components/ProjectsShowcase';

const Page: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('blog');
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Portfolio</span>
          </motion.div>
          
          <div className="hidden md:flex space-x-8">
            {['blog', 'projects', 'gallery', 'contact'].map((section) => (
              <motion.a
                key={section}
                href={`#${section}`}
                className={`font-medium text-sm uppercase tracking-wide hover:text-blue-600 transition-colors ${
                  activeSection === section ? 'text-blue-600' : ''
                }`}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveSection(section)}
              >
                {section}
              </motion.a>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/admin/login" className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="pt-24 pb-8 md:pt-32 md:pb-16"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Welcome to My Portfolio
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Showcasing my creative work, projects, and professional journey
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Blog Section */}
      <motion.section
        id="blog"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="py-16 bg-white dark:bg-gray-800"
      >
        <div className="container mx-auto px-4">
          <BlogList />
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        id="projects"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="py-16 bg-gray-50 dark:bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <ProjectsShowcase />
        </div>
      </motion.section>

      {/* Gallery Section */}
      <motion.section
        id="gallery"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="py-16 bg-white dark:bg-gray-800"
      >
        <div className="container mx-auto px-4">
          <GalleryPage />
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="py-16 bg-gray-50 dark:bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <ContactForm />
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="mb-4 md:mb-0"
            >
              <span className="font-bold text-xl">Portfolio</span>
            </motion.div>
            
            <div className="flex space-x-6">
              {['Twitter', 'GitHub', 'LinkedIn', 'Instagram'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ y: -3 }}
                  className="hover:text-blue-400 transition-colors"
                >
                  {social}
                </motion.a>
              ))}
            </div>
            
            <Link href="/admin/login" className="mt-4 md:mt-0 text-sm hover:text-blue-400 transition-colors">
              Admin Login
            </Link>
          </div>
          
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating back to top button */}
      {scrollY > 300 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default Page;