import { useEffect, useState } from 'react'
import {
  getDeliveries,
  updateDeliveryStatus,
} from '../services/api'


function RiderDashboard({ user, onLogout }) {

  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')


  const loadDeliveries = async () => {

    try {

      setError('')

      const data =
        await getDeliveries(user.token)

      setDeliveries(data)

    } catch (err) {

      setError(err.message)

    } finally {

      setLoading(false)

    }
  }


  useEffect(() => {
    loadDeliveries()
  }, [])


  const handleStatusUpdate = async (
    deliveryId,
    newStatus
  ) => {

    try {

      setError('')
      setSuccess('')

      await updateDeliveryStatus(
        user.token,
        deliveryId,
        newStatus
      )

      setSuccess(
        `Delivery updated to ${newStatus.replace('_', ' ')}.`
      )

      await loadDeliveries()

    } catch (err) {

      setError(err.message)

    }
  }


  const getNextAction = (status) => {

    switch (status) {

      case 'assigned':
        return {
          label: 'Pick Up Package',
          nextStatus: 'picked_up',
        }

      case 'picked_up':
        return {
          label: 'Start Delivery',
          nextStatus: 'in_transit',
        }

      case 'in_transit':
        return {
          label: 'Mark as Delivered',
          nextStatus: 'delivered',
        }

      default:
        return null
    }
  }


  const activeDeliveries =
    deliveries.filter(delivery =>
      [
        'assigned',
        'picked_up',
        'in_transit',
      ].includes(delivery.status)
    )


  const completedDeliveries =
    deliveries.filter(
      delivery =>
        delivery.status === 'delivered'
    )


  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <header className="bg-white border-b">

        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

          <div>

            <h1 className="text-2xl font-bold">
              MobiTrack
            </h1>

            <p className="text-sm text-gray-500">
              Rider Dashboard
            </p>

          </div>


          <div className="flex items-center gap-4">

            <div className="text-right">

              <p className="font-medium">
                {user.username}
              </p>

              <p className="text-sm text-green-600">
                Rider
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


      <main className="max-w-6xl mx-auto p-6">

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
              Active Deliveries
            </p>

            <p className="text-3xl font-bold mt-2">
              {activeDeliveries.length}
            </p>

          </div>


          <div className="bg-white rounded-xl shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Completed
            </p>

            <p className="text-3xl font-bold mt-2">
              {completedDeliveries.length}
            </p>

          </div>


          <div className="bg-white rounded-xl shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Availability
            </p>

            <p className="text-3xl font-bold mt-2">

              {activeDeliveries.length > 0
                ? 'Busy'
                : 'Available'}

            </p>

          </div>

        </div>


        {/* Active Deliveries */}

        <section className="bg-white rounded-xl shadow-sm p-6 mb-8">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-xl font-semibold">
                My Active Deliveries
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Complete each delivery step in order.
              </p>

            </div>


            <button
              onClick={loadDeliveries}
              className="text-blue-600 hover:underline text-sm"
            >
              Refresh
            </button>

          </div>


          {loading ? (

            <p className="text-gray-500">
              Loading deliveries...
            </p>

          ) : activeDeliveries.length === 0 ? (

            <div className="text-center py-10">

              <p className="text-gray-500">
                You have no active deliveries.
              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {activeDeliveries.map(delivery => {

                const action =
                  getNextAction(
                    delivery.status
                  )

                return (

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


                      <span className="self-start px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                        {delivery.status_display}
                      </span>

                    </div>


                    {/* Route */}

                    <div className="grid md:grid-cols-2 gap-4 mt-6">

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
                          Deliver To
                        </p>

                        <p className="font-medium mt-1">
                          {delivery.delivery_address}
                        </p>

                      </div>

                    </div>


                    {/* Package */}

                    {delivery.description && (

                      <div className="mt-5">

                        <p className="text-xs uppercase text-gray-500">
                          Package
                        </p>

                        <p className="mt-1 text-gray-700">
                          {delivery.description}
                        </p>

                      </div>

                    )}


                    {/* Progress */}

                    <div className="mt-8">

                      <div className="flex items-center">

                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            [
                              'assigned',
                              'picked_up',
                              'in_transit',
                            ].includes(delivery.status)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200'
                          }`}
                        >
                          1
                        </div>


                        <div className="flex-1 h-1 bg-gray-200 mx-2">

                          <div
                            className={`h-full ${
                              [
                                'picked_up',
                                'in_transit',
                              ].includes(delivery.status)
                                ? 'bg-blue-600 w-full'
                                : 'w-0'
                            }`}
                          />

                        </div>


                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            [
                              'picked_up',
                              'in_transit',
                            ].includes(delivery.status)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200'
                          }`}
                        >
                          2
                        </div>


                        <div className="flex-1 h-1 bg-gray-200 mx-2">

                          <div
                            className={`h-full ${
                              delivery.status ===
                              'in_transit'
                                ? 'bg-blue-600 w-full'
                                : 'w-0'
                            }`}
                          />

                        </div>


                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            delivery.status ===
                            'in_transit'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200'
                          }`}
                        >
                          3
                        </div>

                      </div>


                      <div className="flex justify-between text-xs text-gray-500 mt-2">

                        <span>Assigned</span>
                        <span>Picked Up</span>
                        <span>In Transit</span>

                      </div>

                    </div>


                    {/* Action */}

                    {action && (

                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            delivery.id,
                            action.nextStatus
                          )
                        }
                        className="mt-7 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
                      >
                        {action.label}
                      </button>

                    )}

                  </div>

                )

              })}

            </div>

          )}

        </section>


        {/* Completed */}

        <section className="bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-xl font-semibold mb-5">
            Completed Deliveries
          </h2>


          {completedDeliveries.length === 0 ? (

            <p className="text-gray-500">
              No completed deliveries yet.
            </p>

          ) : (

            <div className="space-y-3">

              {completedDeliveries.map(delivery => (

                <div
                  key={delivery.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >

                  <div>

                    <p className="font-semibold">
                      {delivery.order_number}
                    </p>

                    <p className="text-sm text-gray-500">
                      {delivery.delivery_address}
                    </p>

                  </div>


                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Delivered
                  </span>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  )
}


export default RiderDashboard