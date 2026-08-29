import { useState } from 'react'
import { trackDelivery } from '../services/api'


function Tracking() {
  const [orderNumber, setOrderNumber] = useState('')
  const [delivery, setDelivery] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


  const handleTrack = async (e) => {
    e.preventDefault()

    if (!orderNumber.trim()) {
      setError('Please enter an order number.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setDelivery(null)

      const data = await trackDelivery(
        orderNumber.trim()
      )

      setDelivery(data)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }


  const statuses = [
    {
      key: 'pending',
      label: 'Order Created'
    },
    {
      key: 'accepted',
      label: 'Accepted'
    },
    {
      key: 'assigned',
      label: 'Rider Assigned'
    },
    {
      key: 'picked_up',
      label: 'Picked Up'
    },
    {
      key: 'in_transit',
      label: 'In Transit'
    },
    {
      key: 'delivered',
      label: 'Delivered'
    }
  ]


  const statusOrder = statuses.map(
    status => status.key
  )


  const currentIndex = delivery
    ? statusOrder.indexOf(delivery.status)
    : -1


  return (
    <div className="min-h-screen bg-gray-100">

      <header className="bg-white border-b">

        <div className="max-w-5xl mx-auto px-6 py-5">

          <h1 className="text-2xl font-bold">
            MobiTrack
          </h1>

          <p className="text-sm text-gray-500">
            Track Your Delivery
          </p>

        </div>

      </header>


      <main className="max-w-3xl mx-auto px-6 py-12">

        <div className="bg-white rounded-xl shadow-sm p-8">

          <div className="text-center mb-8">

            <h2 className="text-2xl font-bold">
              Track Your Order
            </h2>

            <p className="text-gray-500 mt-2">
              Enter your order number to see delivery progress.
            </p>

          </div>


          <form
            onSubmit={handleTrack}
            className="flex flex-col sm:flex-row gap-3"
          >

            <input
              type="text"
              value={orderNumber}
              onChange={(e) =>
                setOrderNumber(e.target.value)
              }
              placeholder="e.g. ORD-001"
              className="flex-1 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>

          </form>


          {error && (

            <div className="mt-5 bg-red-100 text-red-700 rounded-lg p-4">
              {error}
            </div>

          )}


          {delivery && (

            <div className="mt-10">

              {/* Order information */}

              <div className="border-b pb-5">

                <p className="text-sm text-gray-500">
                  Order Number
                </p>

                <h3 className="text-2xl font-bold">
                  {delivery.order_number}
                </h3>

                <p className="mt-2">
                  Current Status:{' '}
                  <span className="font-semibold">
                    {delivery.status_display}
                  </span>
                </p>

              </div>


              {/* Delivery route */}

              <div className="grid sm:grid-cols-2 gap-4 mt-6">

                <div className="bg-gray-50 rounded-lg p-4">

                  <p className="text-xs uppercase text-gray-500">
                    Pickup
                  </p>

                  <p className="font-medium mt-1">
                    {delivery.pickup_location}
                  </p>

                </div>


                <div className="bg-gray-50 rounded-lg p-4">

                  <p className="text-xs uppercase text-gray-500">
                    Destination
                  </p>

                  <p className="font-medium mt-1">
                    {delivery.delivery_address}
                  </p>

                </div>

              </div>


              {/* Timeline */}

              <div className="mt-10">

                <h3 className="font-semibold mb-6">
                  Delivery Progress
                </h3>


                <div className="space-y-6">

                  {statuses.map((item, index) => {

                    const completed =
                      index <= currentIndex

                    return (

                      <div
                        key={item.key}
                        className="flex items-center gap-4"
                      >

                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${
                            completed
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {completed ? '✓' : index + 1}
                        </div>


                        <div>

                          <p
                            className={`font-medium ${
                              completed
                                ? 'text-gray-900'
                                : 'text-gray-400'
                            }`}
                          >
                            {item.label}
                          </p>

                        </div>

                      </div>

                    )
                  })}

                </div>

              </div>

            </div>

          )}

        </div>

      </main>

    </div>
  )
}


export default Tracking