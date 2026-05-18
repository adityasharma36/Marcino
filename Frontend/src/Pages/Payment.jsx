import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createOrder } from '../store/Action/OrderAction'
import { currentUser } from '../store/Action/UserAction'
import { getAllCartProDetails, getAllProCart } from '../store/Action/CartAction'
import useUserLocation from '../Utils/useUserLocation'

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

const Payment = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isPaying, setIsPaying] = useState(false)
  const { getLocation } = useUserLocation()

  const cartProduct = useSelector((state) => state?.cart?.allProductCarts)
  const cartList = Array.isArray(cartProduct) ? cartProduct : cartProduct?.data || []
  const allDetails = useSelector((state) => state?.cart?.allProdDetails)
  const userDetail = useSelector((state) => state?.user?.user)
  const currAdd = useSelector((state) => state?.address?.addresses)

  const getCartProductId = (item) => item?.productId || item?.product?._id || item?.product || item?._id || item?.id

  const paymentItems = useMemo(() => cartList
    .map((item) => {
      const productId = getCartProductId(item)
      const productDetails = allDetails.find((detail) => (detail?._id || detail?.id) === productId)
      const qty = item?.qty || item?.quantity || 1

      if (!productId) {
        return null
      }

      return {
        ...productDetails,
        ...item,
        productId,
        qty,
        unitPrice: Number(productDetails?.price?.amount || item?.price?.amount || 0),
        currency: productDetails?.price?.currency || item?.price?.currency || 'INR',
      }
    })
    .filter(Boolean), [allDetails, cartList])

    console.log("paymentItems", paymentItems)

  const subtotal = paymentItems.reduce((sum, item) => sum + Number(item?.unitPrice || 0) * Number(item?.qty || 1), 0)
  const deliveryCharge = subtotal > 100 ? 0 : 50
  const shippingCharge = 4
  const grandTotal = subtotal + deliveryCharge + shippingCharge

  useEffect(() => {
    if (!cartList.length) {
      dispatch(getAllProCart())
      return
    }

    dispatch(getAllCartProDetails(cartList))
  }, [cartList.length, dispatch])

  useEffect(() => {
    if (!userDetail) {
      dispatch(currentUser())
    }
  }, [dispatch, userDetail])

  const handlePayment = async () => {
    const shippingAddress = {
      street: currAdd?.[0]?.street || '',
      city: currAdd?.[0]?.city || '',
      state: currAdd?.[0]?.state || '',
      pincode: currAdd?.[0]?.zipcode || currAdd?.[0]?.pincode || '',
      country: currAdd?.[0]?.country || '',
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode || !shippingAddress.country) {
      toast.error('Please add or detect your shipping address first')
      return
    }

    if (!paymentItems.length) {
      toast.error('Your cart is empty')
      return
    }

    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID

    if (!keyId) {
      toast.error('Missing Razorpay test key')
      return
    }

    setIsPaying(true)

    const scriptLoaded = await loadRazorpayScript()

    if (!scriptLoaded) {
      setIsPaying(false)
      toast.error('Failed to load Razorpay checkout')
      return
    }

    const options = {
      key: keyId,
      amount: Math.round(grandTotal * 100),
      currency: 'INR',
      name: 'Marcino',
      description: 'Test checkout payment',
      prefill: {
        name: `${userDetail?.fullName?.firstName || ''} ${userDetail?.fullName?.lastName || ''}`.trim(),
        email: userDetail?.email || '',
        contact: currAdd?.[0]?.phone || '',
      },
      theme: {
        color: '#ef4444',
      },
      handler: async (response) => {
        try {
          const orderPayload = {
            items: paymentItems.map((item) => ({
              productId: item.productId,
              quantity: item.qty,
              price: item.unitPrice,
            })),
            subtotal,
            deliveryCharge,
            shippingCharge,
            totalAmount: grandTotal,
            grandTotal,
            currency: 'INR',
            payment: {
              provider: 'razorpay_test',
              paymentId: response?.razorpay_payment_id,
              orderId: response?.razorpay_order_id,
              signature: response?.razorpay_signature,
            },
            shippingAddress,
            customer: userDetail || {},
          }

          await dispatch(createOrder(orderPayload))

          toast.success('Payment successful and order created')
          navigate('/Order')
        } catch (error) {
          toast.error('Payment succeeded, but order creation failed')
        } finally {
          setIsPaying(false)
        }
      },
      modal: {
        ondismiss: () => {
          setIsPaying(false)
        },
      },
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  }

  return (
    <div className="mt-10 max-w-6xl mx-auto mb-5 px-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl">Payment</h1>
          <p className="text-gray-600 mt-2">Razorpay test payment route</p>
        </div>

        <button
          onClick={() => navigate('/Order')}
          className="border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50"
        >
          Back to Order
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="space-y-3">
          <h2 className="font-semibold text-xl">Payment Items</h2>
          {paymentItems.length > 0 ? paymentItems.map((item) => {
            const itemTotal = Number(item?.unitPrice || 0) * Number(item?.qty || 1)
            console.log(item)

            return (
                
              <div key={item.productId} className="bg-gray-100 rounded-md p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.images?.[0].url || item.thumbnail}
                    alt={item.thumbnail || item.title}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div>
                    <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                    <p className="text-red-500 font-semibold">{`${item.currency} ${itemTotal}`}</p>
                  </div>
                </div>

                <span className="font-semibold text-gray-700">Qty: {item.qty}</span>
              </div>
            )
          }) : (
            <div className="bg-gray-100 rounded-md p-6 text-gray-600">No items in cart.</div>
          )}
        </div>

        <div className="bg-white border-gray-100 shadow-xl rounded-md p-7 space-y-3 h-max">
          <h2 className="text-gray-800 font-bold text-xl">Bill Details</h2>
          <button
            onClick={getLocation}
            className="border border-gray-200 text-gray-700 px-3 py-2 rounded-md w-full"
          >
            Detect Location
          </button>

          <div className="flex justify-between items-center">
            <span className="text-gray-700">Items total</span>
            <span>{`${paymentItems[0]?.currency || 'INR'} ${subtotal}`}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700">Delivery Charge</span>
            <span className="text-red-500 font-semibold">{deliveryCharge === 0 ? 'Free' : deliveryCharge}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700">Shipping Charge</span>
            <span className="text-red-500 font-semibold">{shippingCharge}</span>
          </div>

          <hr className="text-gray-200 mt-2" />

          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Grand Total</span>
            <span className="font-semibold text-lg">{grandTotal}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={isPaying || !paymentItems.length}
            className="bg-red-500 disabled:opacity-60 text-white px-3 py-3 rounded-md w-full cursor-pointer mt-3"
          >
            {isPaying ? 'Opening Razorpay...' : 'Pay with Razorpay Test'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Payment