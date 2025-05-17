"use client";
import React, { useState, useEffect } from 'react'
import { 
  FiPlus, 
  FiTrash2, 
  FiEdit, 
  FiChevronLeft, 
  FiChevronRight, 
  FiSearch, 
  FiRefreshCw,
  FiCheck,
  FiX,
  FiUpload,
  FiEye,
  FiEyeOff,
  FiCalendar,
  FiTag,
  FiBookmark
} from 'react-icons/fi'

import { toast } from 'react-toastify'
import dynamic from 'next/dynamic'

// Dynamically import the rich text editor for better performance
const RichTextEditor = dynamic(() => import('./../RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
})

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  tags: string[]
  published: boolean
  createdAt: string
  updatedAt: string
}

const BlogAdminPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
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
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    tags: [],
    published: true
  })

  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.push('/auth/signin')
  //   } else if (status === 'authenticated' && session?.user.role !== 'admin') {
  //     router.push('/')
  //   }
  // }, [status, session, router])

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      setRefreshing(true)
      setLoading(true)
      const response = await fetch('/api/blog')
      if (!response.ok) throw new Error('Failed to fetch blog posts')
      const data = await response.json()
      setBlogPosts(data)
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

    // Auto-generate slug from title
    if (name === 'title' && !isEditing) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')
        .slice(0, 60)
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const tagsArray = value.split(',').map(tag => tag.trim())
    setFormData(prev => ({
      ...prev,
      tags: tagsArray
    }))
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'blog')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to upload image')

      const { url } = await response.json()
      setFormData(prev => ({
        ...prev,
        coverImage: url
      }))
      toast.success('Cover image uploaded successfully')
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
        ? '/api/blog' 
        : `/api/blog/${selectedPost?.slug}`
      const method = isCreating ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error(`Failed to ${isCreating ? 'create' : 'update'} blog post`)

      const data = await response.json()
      toast.success(`Blog post ${isCreating ? 'created' : 'updated'} successfully`)

      if (isCreating) {
        setBlogPosts([data, ...blogPosts])
      } else {
        setBlogPosts(blogPosts.map(p => p._id === data._id ? data : p))
      }

      resetForm()
      fetchBlogPosts()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to ${isCreating ? 'create' : 'update'} blog post`)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    
    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete blog post')

      setBlogPosts(blogPosts.filter(p => p.slug !== slug))
      if (selectedPost?.slug === slug) {
        setSelectedPost(null)
      }
      toast.success('Blog post deleted successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete blog post')
    }
  }

  const togglePublishStatus = async (slug: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !currentStatus }),
      })

      if (!response.ok) throw new Error('Failed to update publish status')

      const data = await response.json()
      setBlogPosts(blogPosts.map(p => p.slug === slug ? data : p))
      toast.success(`Blog post ${!currentStatus ? 'published' : 'unpublished'} successfully`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update publish status')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      category: '',
      tags: [],
      published: true
    })
    setIsEditing(false)
    setIsCreating(false)
    setSelectedPost(null)
  }

  const prepareEditForm = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      category: post.category,
      tags: post.tags,
      published: post.published
    })
    setIsEditing(true)
    setIsCreating(false)
    setSelectedPost(post)
  }

  const prepareCreateForm = () => {
    resetForm()
    setIsCreating(true)
    setIsEditing(false)
  }

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)

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
            <div className="bg-green-100 p-3 rounded-xl mr-4">
              <FiBookmark className="text-green-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Blog Management</h1>
              <div className="flex items-center mt-1">
                <span className="text-gray-500 text-sm">
                  {blogPosts.length} total posts • {blogPosts.filter(p => p.published).length} published
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchBlogPosts}
              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
              disabled={refreshing}
            >
              <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={prepareCreateForm}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <FiPlus className="mr-2" /> New Post
            </button>
          </div>
        </div>

        {(isEditing || isCreating) && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {isCreating ? 'Create New Blog Post' : `Edit "${selectedPost?.title}"`}
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
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt*</label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags?.join(', ')}
                      onChange={handleTagsChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      name="published"
                      checked={formData.published || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                      Published
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image*</label>
                    {formData.coverImage ? (
                      <div className="relative">
                        <img 
                          src={formData.coverImage} 
                          alt="Cover preview" 
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
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
                          <div className="mt-2 text-sm text-green-600">Uploading...</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content*</label>
                <RichTextEditor
                  value={formData.content || ''}
                  onChange={handleContentChange}
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
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
                  disabled={!formData.coverImage}
                >
                  <FiCheck className="mr-2" />
                  {isCreating ? 'Publish Post' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {!isEditing && !isCreating && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {filteredPosts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No blog posts found
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {currentItems.map(post => (
                    <div
                      key={post._id}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      <div className="relative h-48 bg-gray-100">
                        {post.coverImage && (
                          <img 
                            src={post.coverImage} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {!post.published && (
                          <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                            Draft
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg text-gray-800 mb-1">{post.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded ${post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.excerpt}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {post.category}
                          </span>
                          {post.tags?.map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center">
                            <FiCalendar className="mr-1" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                          {post.updatedAt !== post.createdAt && (
                            <span>(Updated)</span>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => togglePublishStatus(post.slug, post.published)}
                              className={`p-2 rounded-full transition ${post.published ? 'text-green-600 hover:bg-green-100' : 'text-gray-600 hover:bg-gray-100'}`}
                              title={post.published ? 'Unpublish' : 'Publish'}
                            >
                              {post.published ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => prepareEditForm(post)}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition"
                              title="Edit"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(post.slug)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {filteredPosts.length > itemsPerPage && (
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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogAdminPage