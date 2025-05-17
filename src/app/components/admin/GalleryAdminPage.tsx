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
  FiImage
} from 'react-icons/fi'
// import { useSession } from 'next-auth/react'
// import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

interface GalleryItem {
  _id: string
  title: string
  caption?: string
  imageUrl: string
  createdAt: string
}

const GalleryAdminPage = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [refreshing, setRefreshing] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  // const { data: session, status } = useSession()
  // const router = useRouter()

  // Form state
  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    title: '',
    caption: '',
    imageUrl: ''
  })

  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.push('/auth/signin')
  //   } else if (status === 'authenticated' && session?.user.role !== 'admin') {
  //     router.push('/')
  //   }
  // }, [status, session, router])

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      setRefreshing(true)
      setLoading(true)
      const response = await fetch('/api/gallery')
      if (!response.ok) throw new Error('Failed to fetch gallery items')
      const data = await response.json()
      setGalleryItems(data)
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'gallery')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to upload image')

      const { url } = await response.json()
      setFormData(prev => ({
        ...prev,
        imageUrl: url
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
        ? '/api/gallery' 
        : `/api/gallery/${selectedItem?._id}`
      const method = isCreating ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error(`Failed to ${isCreating ? 'create' : 'update'} gallery item`)

      const data = await response.json()
      toast.success(`Gallery item ${isCreating ? 'created' : 'updated'} successfully`)

      if (isCreating) {
        setGalleryItems([data, ...galleryItems])
      } else {
        setGalleryItems(galleryItems.map(item => item._id === data._id ? data : item))
      }

      resetForm()
      fetchGalleryItems()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to ${isCreating ? 'create' : 'update'} gallery item`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return
    
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete gallery item')

      setGalleryItems(galleryItems.filter(item => item._id !== id))
      if (selectedItem?._id === id) {
        setSelectedItem(null)
      }
      toast.success('Gallery item deleted successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete gallery item')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      caption: '',
      imageUrl: ''
    })
    setIsEditing(false)
    setIsCreating(false)
    setSelectedItem(null)
  }

  const prepareEditForm = (item: GalleryItem) => {
    setFormData({
      title: item.title,
      caption: item.caption || '',
      imageUrl: item.imageUrl
    })
    setIsEditing(true)
    setIsCreating(false)
    setSelectedItem(item)
  }

  const prepareCreateForm = () => {
    resetForm()
    setIsCreating(true)
    setIsEditing(false)
  }

  const filteredItems = galleryItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.caption && item.caption.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

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
            <div className="bg-purple-100 p-3 rounded-xl mr-4">
              <FiImage className="text-purple-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gallery Management</h1>
              <div className="flex items-center mt-1">
                <span className="text-gray-500 text-sm">
                  {galleryItems.length} total items
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search gallery..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchGalleryItems}
              className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition"
              disabled={refreshing}
            >
              <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={prepareCreateForm}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <FiPlus className="mr-2" /> Add Item
            </button>
          </div>
        </div>

        {(isEditing || isCreating) && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {isCreating ? 'Add New Gallery Item' : `Edit "${selectedItem?.title}"`}
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
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                    <textarea
                      name="caption"
                      value={formData.caption || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image*</label>
                    {formData.imageUrl ? (
                      <div className="relative">
                        <img 
                          src={formData.imageUrl} 
                          alt="Gallery preview" 
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
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
                          <div className="mt-2 text-sm text-purple-600">Uploading...</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center"
                  disabled={!formData.imageUrl}
                >
                  <FiCheck className="mr-2" />
                  {isCreating ? 'Add to Gallery' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {!isEditing && !isCreating && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No gallery items found
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                  {currentItems.map(item => (
                    <div
                      key={item._id}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition group"
                    >
                      <div className="relative aspect-square bg-gray-100">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => prepareEditForm(item)}
                              className="p-2 bg-white text-purple-600 rounded-full hover:bg-purple-50 transition"
                              title="Edit"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-800 truncate">{item.title}</h3>
                        {item.caption && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.caption}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {filteredItems.length > itemsPerPage && (
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

export default GalleryAdminPage