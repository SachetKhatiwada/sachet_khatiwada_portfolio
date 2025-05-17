"use client";
import React, { useState, useEffect } from 'react'
import { 
  FiPlus, 
  FiTrash2, 
  FiEdit, 
  FiEye, 
  FiEyeOff, 
  FiChevronLeft, 
  FiChevronRight, 
  FiSearch, 
  FiRefreshCw,
  FiCheck,
  FiX,
  FiUpload,
  FiLink,
  FiGithub,
  FiExternalLink
} from 'react-icons/fi'

import { toast } from 'react-toastify'

interface Project {
  _id: string
  title: string
  slug: string
  description: string
  content: string
  technologies: string[]
  image: string
  demoUrl?: string
  githubUrl?: string
  featured: boolean
  createdAt: string
}

const ProjectsAdminPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [refreshing, setRefreshing] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  // const { data: session, status } = useSession()
  // const router = useRouter()

  // Form state
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    description: '',
    content: '',
    technologies: [],
    image: '',
    demoUrl: '',
    githubUrl: '',
    featured: false
  })

  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.push('/auth/signin')
  //   } else if (status === 'authenticated' && session?.user.role !== 'admin') {
  //     router.push('/')
  //   }
  // }, [status, session, router])

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setRefreshing(true)
      setLoading(true)
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('Failed to fetch projects')
      const data = await response.json()
      setProjects(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const techArray = value.split(',').map(tech => tech.trim())
    setFormData(prev => ({
      ...prev,
      technologies: techArray
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'project')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to upload image')

      const { url } = await response.json()
      setFormData(prev => ({
        ...prev,
        image: url
      }))
      toast.success('Image uploaded successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = isCreating 
        ? '/api/projects' 
        : `/api/projects/${selectedProject?.slug}`
      const method = isCreating ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error(`Failed to ${isCreating ? 'create' : 'update'} project`)

      const data = await response.json()
      toast.success(`Project ${isCreating ? 'created' : 'updated'} successfully`)

      if (isCreating) {
        setProjects([data, ...projects])
      } else {
        setProjects(projects.map(p => p._id === data._id ? data : p))
      }

      resetForm()
      fetchProjects()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to ${isCreating ? 'create' : 'update'} project`)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const response = await fetch(`/api/projects/${slug}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete project')

      setProjects(projects.filter(p => p.slug !== slug))
      if (selectedProject?.slug === slug) {
        setSelectedProject(null)
      }
      toast.success('Project deleted successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete project')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      technologies: [],
      image: '',
      demoUrl: '',
      githubUrl: '',
      featured: false
    })
    setIsEditing(false)
    setIsCreating(false)
    setSelectedProject(null)
  }

  const prepareEditForm = (project: Project) => {
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content,
      technologies: project.technologies,
      image: project.image,
      demoUrl: project.demoUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured
    })
    setIsEditing(true)
    setIsCreating(false)
    setSelectedProject(project)
  }

  const prepareCreateForm = () => {
    resetForm()
    setIsCreating(true)
    setIsEditing(false)
  }

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-xl mr-4">
              <FiLink className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Projects</h1>
              <div className="flex items-center mt-1">
                <span className="text-gray-500 text-sm">
                  {projects.length} total projects
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchProjects}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              disabled={refreshing}
            >
              <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={prepareCreateForm}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FiPlus className="mr-2" /> New Project
            </button>
          </div>
        </div>

        {(isEditing || isCreating) && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {isCreating ? 'Create New Project' : `Edit ${selectedProject?.title}`}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug*</label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Technologies (comma separated)</label>
                    <input
                      type="text"
                      value={formData.technologies?.join(', ')}
                      onChange={handleTechnologiesChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image*</label>
                    {formData.image ? (
                      <div className="relative">
                        <img 
                          src={formData.image} 
                          alt="Project preview" 
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <label className="cursor-pointer">
                          <div className="flex flex-col items-center justify-center">
                            <FiUpload className="text-gray-400 text-2xl mb-2" />
                            <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </div>
                        </label>
                        {uploadingImage && (
                          <div className="mt-2 text-sm text-blue-600">Uploading...</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Demo URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiExternalLink className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        name="demoUrl"
                        value={formData.demoUrl || ''}
                        onChange={handleInputChange}
                        className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiGithub className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        name="githubUrl"
                        value={formData.githubUrl || ''}
                        onChange={handleInputChange}
                        className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                      Featured Project
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content*</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
                >
                  <FiCheck className="mr-2" />
                  {isCreating ? 'Create Project' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {!isEditing && !isCreating && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {currentItems.length === 0 ? (
                <div className="col-span-full p-8 text-center text-gray-500">
                  No projects found
                </div>
              ) : (
                currentItems.map(project => (
                  <div
                    key={project._id}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition"
                  >
                    <div className="relative h-48 bg-gray-100">
                      {project.image && (
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {project.featured && (
                        <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologies?.map((tech, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>Created: {formatDate(project.createdAt)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {project.demoUrl && (
                            <a 
                              href={project.demoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                              title="View Demo"
                            >
                              <FiExternalLink />
                            </a>
                          )}
                          {project.githubUrl && (
                            <a 
                              href={project.githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition"
                              title="View on GitHub"
                            >
                              <FiGithub />
                            </a>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => prepareEditForm(project)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                            title="Edit"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(project.slug)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {filteredProjects.length > itemsPerPage && (
              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
                >
                  <FiChevronLeft className="mr-1" /> Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
                >
                  Next <FiChevronRight className="ml-1" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsAdminPage