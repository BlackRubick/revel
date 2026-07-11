export type UserRole = 'ADMIN' | 'ENCARGADO' | 'ORGANIZER' | 'SCANNER' | 'SCREEN' | 'GUEST'
export type EventStatus = 'DRAFT' | 'ACTIVE' | 'FINISHED' | 'CANCELLED'
export type RSVPStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED'
export type PackageType = 'BASIC' | 'INTERMEDIATE' | 'ALL_INCLUSIVE' | 'ENTERPRISE'
export type MediaStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Company {
  id: string
  name: string
  logo?: string
  email?: string
  phone?: string
  address?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  users?: User[]
  _count?: { users: number }
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  avatar?: string
  isActive: boolean
  companyId?: string
  company?: Company
  createdAt: string
  updatedAt: string
}

export interface AuthPayload {
  user: User
  accessToken: string
  refreshToken: string
}

export interface Package {
  id: string
  type: PackageType
  name: string
  description?: string
  price: number
  features: string[]
  isActive: boolean
}

export interface Event {
  id: string
  slug: string
  name: string
  description?: string
  coverImage?: string
  date: string
  time: string
  venue: string
  venueAddress?: string
  venueMapUrl?: string
  type: string
  tableCount: number
  tableCapacity: number
  status: EventStatus
  packageId: string
  organizerId: string
  qrAlbumCode?: string
  giftListUrl?: string
  customColor?: string
  createdAt: string
  updatedAt: string
  package?: Package
  organizer?: User
  tables?: EventTable[]
  _count?: {
    guests: number
    photos: number
    videos: number
    messages: number
  }
}

export interface EventTable {
  id: string
  eventId: string
  number: number
  name: string
  capacity: number
  positionX: number
  positionY: number
  guests?: Guest[]
}

export interface Guest {
  id: string
  eventId: string
  tableId?: string
  name: string
  phone?: string
  email?: string
  companions: number
  rsvpStatus: RSVPStatus
  rsvpAt?: string
  checkedIn: boolean
  checkedInAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
  table?: EventTable
  qrCodes?: QRCode[]
}

export interface Invitation {
  id: string
  guestId: string
  eventId: string
  pdfUrl?: string
  sentAt?: string
  viewedAt?: string
  sentViaWhatsApp: boolean
  createdAt: string
}

export interface QRCode {
  id: string
  eventId: string
  guestId?: string
  type: string
  code: string
  qrImage?: string
  usedAt?: string
  usedCount: number
  isActive: boolean
  createdAt: string
}

export interface Photo {
  id: string
  eventId: string
  guestId?: string
  url: string
  thumbnailUrl?: string
  publicId: string
  caption?: string
  status: MediaStatus
  uploadedAt: string
  guest?: Pick<Guest, 'id' | 'name'>
}

export interface Video {
  id: string
  eventId: string
  guestId?: string
  url: string
  thumbnailUrl?: string
  publicId: string
  duration?: number
  status: MediaStatus
  uploadedAt: string
}

export interface GuestMessage {
  id: string
  eventId: string
  guestId?: string
  guestName: string
  message: string
  isApproved: boolean
  createdAt: string
}

export interface Supplier {
  id: string
  name: string
  category: string
  email?: string
  phone?: string
  website?: string
  address?: string
  notes?: string
  isActive: boolean
  creatorId: string
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalEvents: number
  activeEvents: number
  totalGuests: number
  confirmedGuests: number
  pendingGuests: number
  totalPhotos: number
  totalRevenue: number
  recentEvents: Event[]
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface TableAssignment {
  guestId: string
  tableId: string | null
}
