import { useEffect, useState } from 'react'
import {
  getDeliveries,
  getRiders,
  acceptDelivery,
  rejectDelivery,
  assignRider,
} from '../services/api'


function DispatcherDashboard({ user, onLogout }) {

  const [deliveries, setDeliveries] = useState([])
  const [riders, setRiders] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [selectedRiders, setSelectedRiders] = useState({})


  const loadData = async () => {

    try {

      setError('')

      const [deliveryData, riderData] =
        await Promise.all([
          getDeliveries(user.token),
          getRiders(user.token),
        ])

      setDeliveries(deliveryData)
      setRiders(riderData)

    } catch (err) {

      setError(err.message)

    } finally {

      setLoading(false)

    }
  }


  useEffect(() => {
    loadData()
  }, [])


  const handleAccept = async (id) => {

    try {

      setError('')
      setSuccess('')

      await acceptDelivery(
        user.token,
        id
      )

      setSuccess('Delivery accepted.')

      await loadData()

    } catch (err) {

      setError(err.message)

    }
  }


  const handleReject = async (id) => {

    try {

      setError('')
      setSuccess('')

      await rejectDelivery(
        user.token,
        id
      )

      setSuccess('Delivery rejected.')

      await loadData()

    } catch (err) {

      setError(err.message)

    }
  }


  const handleRiderChange = (deliveryId, riderId) => {

    setSelectedRiders({
      ...selectedRiders,
      [deliveryId]: riderId,
    })

  }


  const handleAssign = async (deliveryId) => {

    const riderId =
      selectedRiders[deliveryId]

    if (!riderId) {

      setError('Please select a rider.')

      return
    }


    try {

      setError('')
      setSuccess('')

      await assignRider(
        user.token,
        deliveryId,
        riderId
      )

      setSuccess('Rider assigned successfully.')

      await loadData()

    } catch (err) {

      setError(err.message)

    }
  }


  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <header className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div>

            <h1 className="text-2xl font-bold">
              MobiTrack
            </h1>

            <p className="text-sm text-gray-500">
              Dispatcher Dashboard
            </p>

          </div>


          <div className="flex items-center gap-4">

            <div className="text-right">

              <p className="font-medium">
                {user.username}
              </p>

              <p className="text-sm text-blue-600">
                Dispatcher
              </p>

            </div>


            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>

          </div>

        </div>

      </header>


      <main className="max-w-7xl mx-auto p-6">

        {/* Messages */}

        {error && (

          <div className="mb-6 bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>

        )}


        {success && (

          <div className="mb-6 bg-green-100 text-green-700 p-4 rounded-lg">
            {success}
          </div>

        )}


        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          <div className="bg-white rounded-xl shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Total Deliveries
            </p>

            <p className="text-3xl font-bold mt-2">
              {deliveries.length}
            </p>

          </div>


          <div className="bg-white rounded-xl shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Pending
            </p>

            <p className="text-3xl font-bold mt-2">
              {
                deliveries.filter(
                  d => d.status === 'pending'
                ).length
              }
            </p>

          </div>


          <div className="bg-white rounded-xl shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Available Riders
            </p>

            <p className="text-3xl font-bold mt-2">
              {
                riders.filter(
                  r => r.availability === 'available'
                ).length
              }
            </p>

          </div>

        </div>


        {/* Deliveries */}

        <section className="bg-white rounded-xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-xl font-semibold">
                Deliveries
              </h2>

              <p className="text-sm text-gray-500">
                Manage incoming delivery orders.
              </p>

            </div>


            <button
              onClick={loadData}
              className="text-blue-600 hover:underline text-sm"
            >
              Refresh
            </button>

          </div>


          {loading ? (

            <p className="text-gray-500">
              Loading...
            </p>

          ) : deliveries.length === 0 ? (

            <p className="text-gray-500 text-center py-10">
              No deliveries available.
            </p>

          ) : (

            <div className="space-y-5">

              {deliveries.map(delivery => (

                <div
                  key={delivery.id}
                  className="border rounded-xl p-6"
                >

                  <div className="flex flex-col md:flex-row md:justify-between gap-4">

                    <div>

                      <p className="text-sm text-gray-500">
                        Order
                      </p>

                      <h3 className="text-xl font-bold">
                        {delivery.order_number}
                      </h3>

                    </div>


                    <span className="self-start px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm">
                      {delivery.status_display}
                    </span>

                  </div>


                  <div className="grid md:grid-cols-2 gap-4 mt-5">

                    <div className="bg-gray-50 rounded-lg p-4">

                      <p className="text-xs text-gray-500 uppercase">
                        Pickup
                      </p>

                      <p className="font-medium mt-1">
                        {delivery.pickup_location}
                      </p>

                    </div>


                    <div className="bg-gray-50 rounded-lg p-4">

                      <p className="text-xs text-gray-500 uppercase">
                        Destination
                      </p>

                      <p className="font-medium mt-1">
                        {delivery.delivery_address}
                      </p>

                    </div>

                  </div>


                  {/* Pending Actions */}

                  {delivery.status === 'pending' && (

                    <div className="flex gap-3 mt-6">

                      <button
                        onClick={() =>
                          handleAccept(delivery.id)
                        }
                        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                      >
                        Accept
                      </button>


                      <button
                        onClick={() =>
                          handleReject(delivery.id)
                        }
                        className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                      >
                        Reject
                      </button>

                    </div>

                  )}


                  {/* Assign Rider */}

                  {delivery.status === 'accepted' && (

                    <div className="mt-6">

                      <p className="text-sm font-medium mb-2">
                        Assign Rider
                      </p>


                      <div className="flex flex-col sm:flex-row gap-3">

                        <select
                          value={
                            selectedRiders[
                              delivery.id
                            ] || ''
                          }
                          onChange={(e) =>
                            handleRiderChange(
                              delivery.id,
                              e.target.value
                            )
                          }
                          className="border rounded-lg px-4 py-3 flex-1"
                        >

                          <option value="">
                            Select a rider
                          </option>

                          {riders
                            .filter(
                              rider =>
                                rider.availability ===
                                'available'
                            )
                            .map(rider => (

                              <option
                                key={rider.id}
                                value={rider.id}
                              >
                                {rider.username}
                              </option>

                            ))}

                        </select>


                        <button
                          onClick={() =>
                            handleAssign(
                              delivery.id
                            )
                          }
                          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                        >
                          Assign Rider
                        </button>

                      </div>

                    </div>

                  )}


                  {/* Assigned Rider */}

                  {delivery.rider && (

                    <div className="mt-5 bg-gray-50 rounded-lg p-4">

                      <p className="text-xs uppercase text-gray-500">
                        Assigned Rider
                      </p>

                      <p className="font-medium mt-1">
                        {delivery.rider_username ||
                          delivery.rider?.username ||
                          'Rider assigned'}
                      </p>

                    </div>

                  )}

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  )
}


export default DispatcherDashboard