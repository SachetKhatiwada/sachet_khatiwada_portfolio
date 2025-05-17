'use client';

import BlogAdminPage from '@/app/components/admin/BlogAdminPage';
import ContactAdminPage from '@/app/components/admin/ContactAdminPage';
import GalleryAdminPage from '@/app/components/admin/GalleryAdminPage';
import ProjectsAdminPage from '@/app/components/admin/ProjectsAdminPage';
import React, { useState } from 'react';
import { Settings, MessageSquare, Image, FileText, Menu, X, Bell, LogOut, Home } from 'lucide-react';
import { signOut } from "next-auth/react";

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'contact':
        return <ContactAdminPage />;
      case 'projects':
        return <ProjectsAdminPage />;
      case 'gallery':
        return <GalleryAdminPage />;
      case 'blog':
        return <BlogAdminPage />;
      default:
        return <ContactAdminPage />;
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top bar with logout */}
      <div className="bg-indigo-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Home size={16} className="mr-2" />
            <span className="text-sm font-medium">Admin Portal</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center text-sm bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded-md transition-colors duration-200"
          >
            <LogOut size={16} className="mr-1" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-indigo-600">Admin Dashboard</h1>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <button 
                className={`${activeTab === 'contact' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-900'} px-3 py-2 text-sm font-medium transition-colors duration-200`}
                onClick={() => setActiveTab('contact')}
              >
                Contacts
              </button>
              <button 
                className={`${activeTab === 'projects' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-900'} px-3 py-2 text-sm font-medium transition-colors duration-200`}
                onClick={() => setActiveTab('projects')}
              >
                Projects
              </button>
              <button 
                className={`${activeTab === 'gallery' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-900'} px-3 py-2 text-sm font-medium transition-colors duration-200`}
                onClick={() => setActiveTab('gallery')}
              >
                Gallery
              </button>
              <button 
                className={`${activeTab === 'blog' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-900'} px-3 py-2 text-sm font-medium transition-colors duration-200`}
                onClick={() => setActiveTab('blog')}
              >
                Blog
              </button>
            </nav>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                  A
                </div>
                <span className="text-sm text-gray-700 font-medium">Admin</span>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button 
                className={`${activeTab === 'contact' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'} block px-3 py-2 rounded-md text-base font-medium w-full text-left`}
                onClick={() => {
                  setActiveTab('contact');
                  setIsMobileMenuOpen(false);
                }}
              >
                Contacts
              </button>
              <button 
                className={`${activeTab === 'projects' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'} block px-3 py-2 rounded-md text-base font-medium w-full text-left`}
                onClick={() => {
                  setActiveTab('projects');
                  setIsMobileMenuOpen(false);
                }}
              >
                Projects
              </button>
              <button 
                className={`${activeTab === 'gallery' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'} block px-3 py-2 rounded-md text-base font-medium w-full text-left`}
                onClick={() => {
                  setActiveTab('gallery');
                  setIsMobileMenuOpen(false);
                }}
              >
                Gallery
              </button>
              <button 
                className={`${activeTab === 'blog' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'} block px-3 py-2 rounded-md text-base font-medium w-full text-left`}
                onClick={() => {
                  setActiveTab('blog');
                  setIsMobileMenuOpen(false);
                }}
              >
                Blog
              </button>
              <button 
                className="bg-red-50 text-red-600 hover:bg-red-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">
              {activeTab === 'contact' && 'Contact Requests'}
              {activeTab === 'projects' && 'Projects Management'}
              {activeTab === 'gallery' && 'Gallery Items'}
              {activeTab === 'blog' && 'Blog Posts'}
            </h2>
          </div>
          
          {/* Dashboard Content */}
          <div className="p-6">
            {renderActiveComponent()}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Your Company. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors duration-200">
                <span className="sr-only">Support</span>
                <MessageSquare size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors duration-200">
                <span className="sr-only">Settings</span>
                <Settings size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboardPage;