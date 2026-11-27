import React, { useState, useEffect, useCallback } from 'react'
import {
  MapPin,
  Phone,
  Pencil,
  Trash2,
  PlusCircle,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { type DeliveryAddress } from '../../types/address'
import { addressApi, type BackendAddress } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export type { DeliveryAddress }

interface AddressFormData {
  name: string
  phone: string
  street: string
  colony: string
  city: string
  state: string
  pincode: string
  tag: 'Home' | 'Work' | 'Other'
  isDefault: boolean
}

interface AddressListProps {
  selectedId: string
  onSelectAddress: (id: string, addr?: DeliveryAddress) => void
}

function mapBackendToDeliveryAddress(a: BackendAddress): DeliveryAddress {
  return {
    id: String(a.id),
    name: a.customer_name || a.name || 'Customer',
    phone: a.phone || '',
    tag: (a.tag as 'Home' | 'Work' | 'Other') || 'Home',
    addressLine:
      a.addressLine ||
      `${a.house_details || a.street || ''}, ${a.street_area || a.colony || ''}, ${a.city || ''}, ${a.state || ''} – ${a.pincode || ''}`,
    isDefault: Boolean(a.is_default !== undefined ? a.is_default : a.isDefault),
    house_details: a.house_details || a.street || '',
    street_area: a.street_area || a.colony || '',
    city: a.city || '',
    state: a.state || '',
    pincode: a.pincode || '',
  }
}

const AddressList: React.FC<AddressListProps> = ({
  selectedId,
  onSelectAddress,
}) => {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth()
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState<AddressFormData>({
    name: user?.name || 'Customer',
    phone: '',
    street: '',
    colony: '',
    city: 'Tirunelveli',
    state: 'Tamil Nadu',
    pincode: '',
    tag: 'Home',
    isDefault: false,
  })

  const showFeedback = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text })
    setTimeout(() => setFeedbackMsg(null), 3500)
  }, [])

  // Fetch addresses from backend for authenticated users once auth state is ready
  useEffect(() => {
    if (isAuthLoading) return
    if (!isAuthenticated) return

    let ignore = false

    const loadAddresses = async () => {
      setIsLoading(true)
      setFetchError(null)
      try {
        const serverAddresses = await addressApi.getAddresses()
        if (ignore) return

        if (serverAddresses.length > 0) {
          const mapped = serverAddresses.map(mapBackendToDeliveryAddress)
          setAddresses(mapped)

          // Select default address if none selected yet, without triggering a re-render cycle
          const defaultAddr = mapped.find((a) => a.isDefault) || mapped[0]
          if (defaultAddr) {
            onSelectAddress(defaultAddr.id, defaultAddr)
          }
        } else {
          setAddresses([])
        }
      } catch (err: unknown) {
        if (ignore) return
        const msg = err instanceof Error ? err.message : 'Unable to load delivery addresses.'
        setFetchError(msg)
        setAddresses([])
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadAddresses()

    return () => {
      ignore = true
    }
  }, [isAuthenticated, isAuthLoading, onSelectAddress])

  const handleOpenAddModal = () => {
    setEditingAddressId(null)
    setFormData({
      name: user?.name || 'Customer',
      phone: '',
      street: '',
      colony: '',
      city: 'Tirunelveli',
      state: 'Tamil Nadu',
      pincode: '',
      tag: 'Home',
      isDefault: addresses.length === 0,
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (addr: DeliveryAddress, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingAddressId(addr.id)

    setFormData({
      name: addr.name,
      phone: addr.phone,
      street: addr.house_details || addr.addressLine.split(',')[0] || addr.addressLine,
      colony: addr.street_area || addr.addressLine.split(',')[1]?.trim() || '',
      city: addr.city || 'Tirunelveli',
      state: addr.state || 'Tamil Nadu',
      pincode: addr.pincode || addr.addressLine.match(/\b\d{6}\b/)?.[0] || '627007',
      tag: (addr.tag as 'Home' | 'Work' | 'Other') || 'Home',
      isDefault: Boolean(addr.isDefault),
    })
    setIsModalOpen(true)
  }

  const handleRemove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (addresses.length <= 1) {
      showFeedback('At least one delivery address is required.', 'error')
      return
    }

    if (isAuthenticated) {
      try {
        await addressApi.deleteAddress(id)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to delete address on server.'
        showFeedback(msg, 'error')
        return
      }
    }

    setAddresses((prev) => {
      const remaining = prev.filter((addr) => addr.id !== id)
      if (selectedId === id && remaining.length > 0) {
        onSelectAddress(remaining[0].id, remaining[0])
      }
      return remaining
    })
    showFeedback('Address removed successfully.')
  }

  const handleSetDefault = async (addr: DeliveryAddress, e: React.MouseEvent) => {
    e.stopPropagation()
    if (isAuthenticated) {
      try {
        await addressApi.setDefaultAddress(addr.id)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to set default address.'
        showFeedback(msg, 'error')
        return
      }
    }

    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === addr.id,
      }))
    )
    onSelectAddress(addr.id, { ...addr, isDefault: true })
    showFeedback('Address set as default.')
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.street.trim() || !formData.pincode.trim() || !formData.phone.trim()) {
      showFeedback('Please fill in all required fields.', 'error')
      return
    }

    const payload = {
      customer_name: formData.name.trim(),
      phone: formData.phone.trim(),
      house_details: formData.street.trim(),
      street_area: formData.colony.trim() || formData.street.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
      tag: formData.tag,
      is_default: formData.isDefault,
    }

    setIsSubmitting(true)
    try {
      if (editingAddressId) {
        // Edit existing address
        let updatedAddr: DeliveryAddress
        if (isAuthenticated) {
          const res = await addressApi.updateAddress(editingAddressId, payload)
          updatedAddr = mapBackendToDeliveryAddress(res)
        } else {
          const constructedAddressLine = `${formData.street.trim()}${
            formData.colony ? ', ' + formData.colony.trim() : ''
          }, ${formData.city.trim()}, ${formData.state.trim()} – ${formData.pincode.trim()}`
          updatedAddr = {
            id: editingAddressId,
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            tag: formData.tag,
            addressLine: constructedAddressLine,
            isDefault: formData.isDefault,
            house_details: formData.street.trim(),
            street_area: formData.colony.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            pincode: formData.pincode.trim(),
          }
        }

        setAddresses((prev) =>
          prev.map((a) => (a.id === editingAddressId ? updatedAddr : a))
        )
        if (editingAddressId === selectedId) {
          onSelectAddress(editingAddressId, updatedAddr)
        }
        showFeedback('Address updated successfully.')
      } else {
        // Create new address
        let newAddr: DeliveryAddress
        if (isAuthenticated) {
          const res = await addressApi.createAddress(payload)
          newAddr = mapBackendToDeliveryAddress(res)
        } else {
          const constructedAddressLine = `${formData.street.trim()}${
            formData.colony ? ', ' + formData.colony.trim() : ''
          }, ${formData.city.trim()}, ${formData.state.trim()} – ${formData.pincode.trim()}`
          newAddr = {
            id: `addr-${Date.now()}`,
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            tag: formData.tag,
            addressLine: constructedAddressLine,
            isDefault: formData.isDefault,
            house_details: formData.street.trim(),
            street_area: formData.colony.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            pincode: formData.pincode.trim(),
          }
        }

        setAddresses((prev) => [...prev, newAddr])
        onSelectAddress(newAddr.id, newAddr)
        showFeedback('New address saved and selected.')
      }
      setIsModalOpen(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save address.'
      showFeedback(msg, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="address-list-card">
      {/* Card Header */}
      <div className="address-list-header">
        <div className="address-header-pin-wrap" aria-hidden="true">
          <MapPin size={22} strokeWidth={2} />
        </div>
        <h2 className="address-list-title">Select Delivery Address</h2>
        {isLoading && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: '#7E3540', fontSize: '13px' }}>
            <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            <span>Loading...</span>
          </div>
        )}
      </div>

      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className={`address-feedback-alert ${feedbackMsg.type}`} role="status">
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Fetch Error Feedback */}
      {fetchError && (
        <div className="address-feedback-alert error" role="alert" style={{ marginBottom: '16px' }}>
          <AlertCircle size={16} />
          <span>{fetchError}</span>
        </div>
      )}

      {/* Address Items */}
      {addresses.length === 0 && !isLoading && !fetchError && (
        <div style={{ padding: '24px 16px', textAlign: 'center', color: '#7A706A', fontSize: '14px' }}>
          No delivery addresses found. Click &quot;Add New Address&quot; below to add one.
        </div>
      )}
      <div className="address-items-group" role="radiogroup" aria-label="Delivery addresses">
        {addresses.map((addr) => {
          const isSelected = addr.id === selectedId

          return (
            <div
              key={addr.id}
              className={`address-item-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectAddress(addr.id, addr)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectAddress(addr.id, addr)
                }
              }}
            >
              {/* Radio Indicator */}
              <div className="address-radio-outer" aria-hidden="true">
                {isSelected && <div className="address-radio-inner" />}
              </div>

              {/* Address Details */}
              <div className="address-item-body">
                <div className="address-item-top-row">
                  <div className="address-name-tag-cluster">
                    <span className="address-user-name">{addr.name}</span>
                    <span className={`address-tag-badge tag-${addr.tag.toLowerCase()}`}>
                      {addr.tag}
                    </span>
                    {addr.isDefault && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: '#FAECE0',
                          color: '#7E3540',
                          padding: '2px 8px',
                          borderRadius: '12px',
                        }}
                      >
                        Default
                      </span>
                    )}
                  </div>

                  {/* Actions: Set Default | Edit | Remove */}
                  <div className="address-actions-cluster">
                    {!addr.isDefault && (
                      <>
                        <button
                          type="button"
                          className="address-action-link-btn"
                          onClick={(e) => handleSetDefault(addr, e)}
                          aria-label={`Set as default for ${addr.name}`}
                        >
                          <span>Set Default</span>
                        </button>
                        <span className="address-action-pipe" aria-hidden="true">|</span>
                      </>
                    )}

                    <button
                      type="button"
                      className="address-action-link-btn"
                      onClick={(e) => handleOpenEditModal(addr, e)}
                      aria-label={`Edit address for ${addr.name}`}
                    >
                      <Pencil size={13} strokeWidth={2} />
                      <span>Edit</span>
                    </button>

                    <span className="address-action-pipe" aria-hidden="true">|</span>

                    <button
                      type="button"
                      className="address-action-link-btn remove-btn"
                      onClick={(e) => handleRemove(addr.id, e)}
                      aria-label={`Remove address for ${addr.name}`}
                    >
                      <Trash2 size={13} strokeWidth={2} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                <p className="address-item-line">{addr.addressLine}</p>

                <div className="address-item-phone">
                  <Phone size={13.5} strokeWidth={2} aria-hidden="true" />
                  <span>{addr.phone}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add New Address Dashed Button */}
      <button
        type="button"
        className="address-add-dashed-btn"
        onClick={handleOpenAddModal}
        aria-label="Add New Address"
      >
        <PlusCircle size={18} strokeWidth={2} />
        <span>Add New Address</span>
      </button>

      {/* Modal Dialog for Add/Edit Address */}
      {isModalOpen && (
        <div className="address-modal-overlay" onClick={() => !isSubmitting && setIsModalOpen(false)}>
          <div
            className="address-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="addressModalTitle"
          >
            <div className="address-modal-header">
              <h3 id="addressModalTitle" className="address-modal-title">
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                type="button"
                className="address-modal-close-btn"
                onClick={() => !isSubmitting && setIsModalOpen(false)}
                aria-label="Close dialog"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="address-modal-form">
              <div className="address-form-grid">
                <div className="address-form-field">
                  <label htmlFor="modalName" className="address-form-label">
                    Full Name <span className="req">*</span>
                  </label>
                  <input
                    id="modalName"
                    type="text"
                    required
                    className="address-form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="address-form-field">
                  <label htmlFor="modalPhone" className="address-form-label">
                    Phone Number (10 digits) <span className="req">*</span>
                  </label>
                  <input
                    id="modalPhone"
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    className="address-form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="address-form-field full-width">
                  <label htmlFor="modalStreet" className="address-form-label">
                    Street Address, Flat / House No. <span className="req">*</span>
                  </label>
                  <input
                    id="modalStreet"
                    type="text"
                    required
                    placeholder="e.g. 12/4, South Street"
                    className="address-form-input"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="address-form-field full-width">
                  <label htmlFor="modalColony" className="address-form-label">
                    Area / Locality / Colony
                  </label>
                  <input
                    id="modalColony"
                    type="text"
                    placeholder="e.g. NGO Colony"
                    className="address-form-input"
                    value={formData.colony}
                    onChange={(e) => setFormData({ ...formData, colony: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="address-form-field">
                  <label htmlFor="modalCity" className="address-form-label">
                    City <span className="req">*</span>
                  </label>
                  <input
                    id="modalCity"
                    type="text"
                    required
                    className="address-form-input"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="address-form-field">
                  <label htmlFor="modalPincode" className="address-form-label">
                    PIN Code (6 digits) <span className="req">*</span>
                  </label>
                  <input
                    id="modalPincode"
                    type="text"
                    required
                    maxLength={6}
                    placeholder="627007"
                    className="address-form-input"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="address-form-field full-width">
                  <label className="address-form-label">Address Type</label>
                  <div className="address-tag-pill-options">
                    {(['Home', 'Work', 'Other'] as const).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={`address-tag-pill-btn ${formData.tag === tag ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, tag })}
                        disabled={isSubmitting}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="address-form-field full-width" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <input
                    id="modalDefault"
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    disabled={isSubmitting}
                    style={{ accentColor: '#7E3540', width: '16px', height: '16px' }}
                  />
                  <label htmlFor="modalDefault" style={{ fontSize: '13px', color: '#495240', cursor: 'pointer' }}>
                    Set as default delivery address
                  </label>
                </div>
              </div>

              <div className="address-modal-actions">
                <button
                  type="button"
                  className="address-modal-cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="address-modal-save-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddressList
