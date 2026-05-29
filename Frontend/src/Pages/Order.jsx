
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrder } from '../store/Action/OrderAction'
import { useNavigate } from 'react-router-dom'

const Order = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const orders = useSelector((state) => state?.order?.orders)
  const orderArr = Array.isArray(orders) ? orders : orders?.data || []

  // console.log(orders)
  const [expandedOrders, setExpandedOrders] = useState({})

  const toggleOrder = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  useEffect(() => {
    if (!orderArr.length) {
      dispatch(getOrder())
    }
  }, [dispatch, orderArr.length])

  return (
    <div className="mt-10 max-w-6xl mx-auto mb-5 px-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl">My Orders</h1>
          <p className="text-gray-600 mt-2">Track your recent orders</p>
        </div>

        <button
          onClick={() => navigate('/Product')}
          className="border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50"
        >
          Back to Cart
        </button>
      </div>

      <div className="mt-8 space-y-3">
        {orderArr.length > 0 ? orderArr.map((order, index) => {
          const orderId = order?._id || order?.id || `order-${index}`
          const items = Array.isArray(order?.items) ? order.items : []
          const totalAmount = order?.totalPrice?.amount ?? order?.totalAmount ?? order?.grandTotal ?? ''
          const currency = order?.totalPrice?.currency || 'INR'

          return (
            <div key={orderId} className="bg-gray-100 rounded-md p-5 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-lg">Order #{index + 1}</h2>
                  <p className="text-sm text-gray-600">Status: {order?.status || 'PENDING'}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-red-500">{currency} {totalAmount}</p>
                  <button
                    onClick={() => toggleOrder(orderId)}
                    className="border border-gray-200 px-3 py-1 rounded-md text-sm hover:bg-gray-50"
                  >
                    {expandedOrders[orderId] ? 'Hide Items' : 'View Items'}
                  </button>
                </div>
              </div>

              {expandedOrders[orderId] && (items.length > 0 ? (
                <div className="space-y-2">
                  {items.map((item, itemIndex) => {
                    const product = item?.product && typeof item.product === 'object' ? item.product : null
                    const title = product?.title || product?.name || 'Item'
                    const imageUrl = product?.images?.[0]?.url || product?.thumbnail || ''
                    console.log(imageUrl);
                    const itemPrice = item?.price?.amount ?? product?.price?.amount ?? ''
                    const itemCurrency = item?.price?.currency || currency

                    return (
                      <div key={item?._id || item?.id || `item-${itemIndex}`} className="flex items-center justify-between bg-white rounded-md p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden">
                            {imageUrl ? (
                              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                            ) : null}
                          </div>
                          <div>
                            <p className="font-medium">{title}</p>
                            <p className="text-sm text-gray-500">{itemCurrency} {itemPrice}</p>
                          </div>
                        </div>
                        <span className="text-gray-700">Qty: {item?.quantity || 1}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No items for this order.</p>
              ))}
            </div>
          )
        }) : (
          <div className="bg-gray-100 rounded-md p-6 text-gray-600">No orders found.</div>
        )}
      </div>
    </div>
  )
}

export default Order