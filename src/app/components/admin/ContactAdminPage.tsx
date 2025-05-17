"use client";
import React, { useState, useEffect } from 'react'
import { 
  FiMail, 
  FiTrash2, 
  FiEye, 
  FiEyeOff, 
  FiChevronLeft, 
  FiChevronRight, 
  FiSearch, 
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi'
// import { useSession } from 'next-auth/react'
// import { useRouter } from 'next/navigation'

interface Contact {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

const ContactAdminPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [refreshing, setRefreshing] = useState(false)
  // const { data: session, status } = useSession()
  // const router = useRouter()

  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.push('/auth/signin')
  //   } else if (status === 'authenticated' && session?.user.role !== 'admin') {
  //     router.push('/')
  //   }
  // }, [status, session, router])

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setRefreshing(true)
      setLoading(true)
      const response = await fetch('/api/contact')
      if (!response.ok) throw new Error('Failed to fetch contacts')
      const data = await response.json()
      setContacts(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const toggleReadStatus = async (id: string) => {
    try {
      const contact = contacts.find(c => c._id === id)
      if (!contact) return
      
      const newReadStatus = !contact.read
      
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: newReadStatus }),
      })

      if (!response.ok) throw new Error('Failed to update contact')

      setContacts(contacts.map(contact =>
        contact._id === id ? { ...contact, read: newReadStatus } : contact
      ))

      if (selectedContact?._id === id) {
        setSelectedContact({ ...selectedContact, read: newReadStatus })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contact')
    }
  }

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete contact')

      setContacts(contacts.filter(contact => contact._id !== id))
      
      if (selectedContact?._id === id) {
        setSelectedContact(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact')
    }
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredContacts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-xl mr-4">
              <FiMail className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Contact Messages</h1>
              <div className="flex items-center mt-1">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {contacts.filter(c => !c.read).length} unread
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-500 text-sm">
                  {contacts.length} total messages
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchContacts}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              disabled={refreshing}
            >
              <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Message List */}
            <div className={`${selectedContact ? 'hidden md:block md:w-2/5' : 'w-full'} border-r border-gray-200`}>
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {currentItems.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No messages found
                  </div>
                ) : (
                  currentItems.map(contact => (
                    <div
                      key={contact._id}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition ${selectedContact?._id === contact._id ? 'bg-blue-50' : ''} ${!contact.read ? 'border-l-4 border-l-blue-500' : ''}`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start w-full">
                          <div 
                            className={`mr-3 mt-1 flex-shrink-0 ${contact.read ? 'text-gray-400' : 'text-blue-500'}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleReadStatus(contact._id)
                            }}
                          >
                            {contact.read ? (
                              <FiCheckCircle className="h-5 w-5" />
                            ) : (
                              <FiAlertCircle className="h-5 w-5" />
                            )}
                          </div>
                          <div className="w-full">
                            <div className="flex justify-between items-start w-full">
                              <h3 className={`font-medium ${contact.read ? 'text-gray-700' : 'text-gray-900 font-semibold'}`}>
                                {contact.name}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatDate(contact.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{contact.email}</p>
                            <div className="flex justify-between items-center mt-1">
                              <p className={`text-sm ${contact.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                                {contact.subject}
                              </p>
                              {!contact.read && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{contact.message}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {filteredContacts.length > itemsPerPage && (
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

            {/* Message Detail View */}
            {selectedContact ? (
              <div className="w-full md:w-3/5">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="w-full">
                      <div className="flex items-start">
                        <button
                          onClick={() => toggleReadStatus(selectedContact._id)}
                          className={`mr-3 ${selectedContact.read ? 'text-gray-400' : 'text-blue-500'}`}
                        >
                          {selectedContact.read ? (
                            <FiCheckCircle className="h-6 w-6" />
                          ) : (
                            <FiAlertCircle className="h-6 w-6" />
                          )}
                        </button>
                        <div className="w-full">
                          <div className="flex justify-between items-start">
                            <h2 className={`text-xl font-bold ${selectedContact.read ? 'text-gray-700' : 'text-gray-900'}`}>
                              {selectedContact.subject}
                            </h2>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toggleReadStatus(selectedContact._id)}
                                className={`p-2 rounded-full transition ${selectedContact.read ? 'text-gray-600 hover:bg-gray-100' : 'text-blue-600 hover:bg-blue-100'}`}
                                title={selectedContact.read ? 'Mark as unread' : 'Mark as read'}
                              >
                                {selectedContact.read ? <FiEyeOff /> : <FiEye />}
                              </button>
                              <button
                                onClick={() => deleteContact(selectedContact._id)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                title="Delete message"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500">
                            <span>{selectedContact.name}</span>
                            <span className="mx-2">•</span>
                            <span>{selectedContact.email}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(selectedContact.createdAt)}</span>
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${selectedContact.read ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-800'}`}>
                              {selectedContact.read ? 'Read' : 'Unread'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-6 p-4 rounded-lg ${selectedContact.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className={`text-sm font-medium ${selectedContact.read ? 'text-gray-500' : 'text-blue-700'}`}>
                        Message Content
                      </h3>
                      {!selectedContact.read && (
                        <button
                          onClick={() => toggleReadStatus(selectedContact._id)}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                    <p className="whitespace-pre-line text-gray-800">{selectedContact.message}</p>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="md:hidden px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      Back to list
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex w-3/5 items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                  <div className="mx-auto bg-gray-200 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <FiMail className="text-2xl text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Select a message</h3>
                  <p className="mt-1 text-sm text-gray-500">Choose a message from the list to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactAdminPage