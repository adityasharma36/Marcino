import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMetrix, getProducts, getOrders } from '../store/Action/DashBoard'
import { LogOut, MapPin, Package, TrendingUp, DollarSign, Star, Mail, Phone, Settings, Edit2, ChevronRight, AlertCircle } from 'lucide-react'
import { logoutUser } from '../store/Action/UserAction'
import { toast } from 'react-toastify'

const DashBoard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const user = useSelector((state) => state?.user?.user)
  const ordersData = useSelector((state) => state?.dashboard?.orders)
  const productsData = useSelector((state) => state?.dashboard?.products)
  const metricsData = useSelector((state) => state?.dashboard?.seller)
  
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [loadingLogout, setLoadingLogout] = useState(false)

  // Normalize data
  const orderArr = Array.isArray(ordersData) ? ordersData : []
  const productsArr = Array.isArray(productsData) ? productsData : []
  const metrics = metricsData?.sales !== undefined ? metricsData : { sales: 0, revenue: 0, topProducts: [] }
 
  useEffect(() => {
    if (!user) {
      navigate('/Login')
      return
    }
    
    dispatch(getMetrix())
    dispatch(getProducts())
    dispatch(getOrders())
  }, [dispatch, user, navigate])

  const handleLogout = async () => {
    setLoadingLogout(true)
    try {
      await dispatch(logoutUser())
      toast.success('Logged out successfully')
      navigate('/Login')
    } catch (error) {
      toast.error('Logout failed')
    } finally {
      setLoadingLogout(false)
    }
  }

  if (!user) {
    return null
  }

  const firstName = user?.fullName?.firstName || user?.firstName || user?.username || 'User'
  const lastName = user?.fullName?.lastName || user?.lastName || ''
  const email = user?.email || 'N/A'
  const phone = user?.phone || user?.phoneNumber || 'Not provided'
  const role = user?.role || 'Customer'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {firstName}!</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loadingLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            {loadingLogout ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Sidebar - Profile */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-24"></div>
              
              <div className="px-6 pb-6">
                <div className="flex items-end gap-4 -mt-12 mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={() => navigate('/edit-profile')}
                    className="ml-auto p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit Profile"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-gray-900">{firstName} {lastName}</h2>
                <p className="text-sm text-blue-600 font-medium capitalize mb-4">{role}</p>

                {/* Profile Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail size={16} className="text-blue-600 flex-shrink-0" />
                    <span className="break-all">{email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone size={16} className="text-blue-600 flex-shrink-0" />
                    <span>{phone}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => navigate('/edit-profile')}
                    className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-lg transition-colors font-medium text-sm"
                  >
                    <Settings size={16} />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate('/address')}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 rounded-lg transition-colors font-medium text-sm"
                  >
                    <MapPin size={16} />
                    Manage Addresses
                  </button>
                </div>
              </div>
            </div>

            {/* Seller Metrics */}
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp size={18} />
                Seller Metrics
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700">Total Sales</span>
                  <span className="text-2xl font-bold text-blue-600">{metrics.sales || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Revenue</span>
                  <span className="text-2xl font-bold text-green-600">₹ {metrics.revenue || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Metrics Details, Orders & Products */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
                <Star size={20} />
                Top Products
              </h3>

              {metrics.topProducts && metrics.topProducts.length > 0 ? (
                <div className="space-y-3">
                  {metrics.topProducts.map((product, index) => (
                    <div key={product?.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">#{index + 1} - {product?.title || 'Product'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{product?.sold || 0}</p>
                        <p className="text-xs text-gray-500">Sold</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600">No sales data yet</p>
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Package size={20} />
                  Recent Orders
                </h3>
                {orderArr.length > 0 && (
                  <button
                    onClick={() => navigate('/Order')}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                  >
                    View All <ChevronRight size={16} />
                  </button>
                )}
              </div>

              {orderArr.length > 0 ? (
                <div className="space-y-3">
                  {orderArr.slice(0, 3).map((order, index) => {
                    const orderId = order?._id || `order-${index}`
                    const items = Array.isArray(order?.items) ? order.items : []
                    const totalAmount = order?.totalPrice?.amount ?? '0'
                    const currency = order?.totalPrice?.currency || 'INR'
                    const status = order?.status || 'PENDING'
                    const statusColor = status === 'DELIVERED' ? 'text-green-600' : status === 'CANCELLED' ? 'text-red-600' : status === 'SHIPPED' ? 'text-blue-600' : 'text-yellow-600'
                    const address = order?.shippingAddress || {}

                    return (
                      <div key={orderId} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">Order #{index + 1}</h4>
                          <span className={`font-semibold text-sm ${statusColor}`}>{status}</span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                        
                        {address.street && (
                          <p className="text-sm text-gray-500 mb-3">
                            📍 {address.street}, {address.city}, {address.state} {address.zip}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-gray-900">{currency} {totalAmount}</p>
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === orderId ? null : orderId)}
                            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors"
                          >
                            {expandedOrder === orderId ? 'Hide' : 'View Items'}
                          </button>
                        </div>

                        {/* Expanded Items */}
                        {expandedOrder === orderId && items.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                            {items.map((item, itemIndex) => {
                              const itemPrice = item?.price?.amount ?? '0'
                              const quantity = item?.quantity || 1
                              const itemCurrency = item?.price?.currency || currency

                              return (
                                <div key={itemIndex} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">Item #{itemIndex + 1}</p>
                                    <p className="text-xs text-gray-500">Qty: {quantity}</p>
                                  </div>
                                  <p className="text-sm font-semibold text-gray-900">{itemCurrency} {itemPrice}</p>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600">No orders yet</p>
                </div>
              )}
            </div>

            {/* Your Products */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Package size={20} />
                  Your Products
                </h3>
                {productsArr.length > 0 && (
                  <button
                    onClick={() => navigate('/products')}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                  >
                    Manage <ChevronRight size={16} />
                  </button>
                )}
              </div>

              {productsArr.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productsArr.slice(0, 4).map((product, index) => {
                    const imageUrl = product?.images?.[0]?.url || ''
                    const title = product?.title || 'Product'
                    const price = product?.price?.amount ?? '0'
                    const currency = product?.price?.currency || 'INR'
                    const stock = product?.stock ?? 0

                    return (
                      <div key={product?._id || index} className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-40 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 truncate mb-2">{title}</h4>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-lg font-bold text-blue-600">{currency} {price}</p>
                            <span className={`text-sm font-medium ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              Stock: {stock}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600 mb-4">No products yet</p>
                  <button
                    onClick={() => navigate('/products')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add Product
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashBoard