import React from 'react'
import ContactForm from '../components/ContactForm'
import ProjectsShowcase from '../components/ProjectsShowcase'
import BlogList from '../components/BlogList'
import GalleryPage from '../components/GalleryPage'
const page = () => {
  return (
    <div className="container mx-auto py-12 px-4">
       <ContactForm />
       <ProjectsShowcase/>
       <BlogList/>
       <GalleryPage/>


       {/* admin */}

    </div>
  )
}

export default page