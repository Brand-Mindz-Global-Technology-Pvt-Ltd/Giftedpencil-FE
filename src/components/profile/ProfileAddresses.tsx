import React, { useState, useEffect } from 'react'
import { MapPin, Plus, Check, Loader2, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { addressApi, type BackendAddress } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

interface DisplayAddress {
  id: string
  tag: string
  isDefault: boolean
  name: string
  phone: string
  addressLine: string
  city: string
  state: string
  pincode: string
}

function mapToDisplay(a: BackendAddress): DisplayAddress {
  return {
    id: String(a.id),
    tag: a.tag || 'Home',
    isDefault: Boolean(a.is_default !== undefined ? a.is_default : a.isDefault),
    name: a.customer_name || a.name || 'Customer',
    phone: a.phone || '',
    addressLine:
      a.addressLine ||
      `${a.house_details || a.street || ''}, ${a.street_area || a.colony || ''}`.trim().replace(/^,\s*|,\s*$/g, ''),
    city: a.city || '',
    state: a.state || '',
    pincode: a.pincode || '',
  }
}

const ProfileAddresses: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const [addresses, setAddresses] = useState<DisplayAddress[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthLoading) return
    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }

    let isMounted = true

    const fetchAddresses = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await addressApi.getAddresses()
        if (isMounted) {
          setAddresses(data.map(mapToDisplay))
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load saved addresses.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchAddresses()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, isAuthLoading])

  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id)
    try {
      await addressApi.setDefaultAddress(id)
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        }))
      )
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to set default address.')
    } finally {
      setSettingDefaultId(null)
    }
  }

  return (
    <div className="profile-card profile-addresses-card">
      <div className="profile-card-header profile-addresses-header">
        <div>
          <h2 className="profile-card-title">Saved Addresses</h2>
          <p className="profile-card-subtitle">
            Manage your delivery addresses and shipping preferences.
          </p>
        </div>
        <Link to="/address" className="profile-add-address-btn" style={{ textDecoration: 'none' }}>
          <Plus size={16} />
          <span>Add New Address</span>
        </Link>
      </div>

      {isLoading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <Loader2 className="animate-spin" size={24} style={{ marginRight: '0.5rem' }} />
          <span>Loading your addresses...</span>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', color: '#dc2626', background: '#fef2f2', borderRadius: '8px', marginBottom: '1rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {!isLoading && !error && addresses.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          <MapPin size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <p style={{ margin: 0, fontWeight: 500 }}>No saved addresses yet.</p>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
            Add an address during checkout or from the addresses page.
          </p>
        </div>
      )}

      {!isLoading && addresses.length > 0 && (
        <div className="profile-addresses-grid">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`profile-address-card ${addr.isDefault ? 'is-default' : ''}`}
            >
              <div className="profile-address-top">
                <div className="profile-address-tag-wrap">
                  <span className="profile-address-tag">{addr.tag}</span>
                  {addr.isDefault && (
                    <span className="profile-default-badge">
                      <Check size={12} strokeWidth={2.5} />
                      <span>Default</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="profile-address-info">
                <h3 className="profile-address-name">{addr.name}</h3>
                <p className="profile-address-phone">{addr.phone}</p>
                <p className="profile-address-text">
                  <MapPin size={14} className="profile-address-pin-icon" />
                  <span>
                    {addr.addressLine}{addr.city ? `, ${addr.city}` : ''}{addr.state ? `, ${addr.state}` : ''}{addr.pincode ? ` – ${addr.pincode}` : ''}
                  </span>
                </p>
              </div>

              {!addr.isDefault && (
                <div className="profile-address-footer">
                  <button
                    type="button"
                    className="profile-set-default-btn"
                    onClick={() => handleSetDefault(addr.id)}
                    disabled={settingDefaultId === addr.id}
                  >
                    {settingDefaultId === addr.id ? 'Setting...' : 'Set as Default'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfileAddresses
