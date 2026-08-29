import { useEffect, useState } from 'react'
import {
  getDeliveries,
  createDelivery,
} from '../services/api'


function RetailerDashboard({ user, onLogout }) {

  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    order_number: '',
    customer: '',
    pickup_location: '',
    delivery_address: '',
    description: '',
  })


  const loadDeliveries = async () => {
    try {
      setError('')

      const data = await getDeliveries(user.token)

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


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }


  const handleCreate = async (e) => {
    e.preventDefault()

    try {
      setCreating(true)
      setError('')
      setSuccess('')

      await createDelivery(
        user.token,
        {
          order_number: form.order_number,
          customer: Number(form.customer),
          pickup_location: form.pickup_location,
          delivery_address: form.delivery_address,
          description: form.description,
        }
      )

      setSuccess('Delivery created successfully.')

      setForm({
        order_number: '',
        customer: '',
        pickup_location: '',
        delivery_address: '',
        description: '',
      })

      await loadDeliveries()

    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <header className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              MobiTrack
            </h1>

            <p className="text-sm text-gray-500">
              Retailer Dashboard
            </p>
          </div>


          <div className="flex items-center gap-4">

            <div className="text-right">

              <p className="font-medium text-gray-900">
                {user.username}
              </p>

              <p className="text-sm text-green-600">
                Retailer
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


        {/* Create Delivery */}

        <section className="bg-white rounded-xl shadow-sm p-6 mb-8">

          <h2 className="text-xl font-semibold mb-6">
            Create New Delivery
          </h2>


          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            <div>

              <label className="block text-sm font-medium mb-2">
                Order Number
              </label>

              <input
                type="text"
                name="order_number"
                value={form.order_number}
                onChange={handleChange}
                placeholder="ORD-002"
                required
                className="w-full border rounded-lg px-4 py-3"
              />

            </div>


            <div>

              <label className="block text-sm font-medium mb-2">
                Customer ID
              </label>

              <input
                type="number"
                name="customer"
                value={form.customer}
                onChange={handleChange}
                placeholder="1"
                required
                className="w-full border rounded-lg px-4 py-3"
              />

            </div>


            <div>

              <label className="block text-sm font-medium mb-2">
                Pickup Location
              </label>

              <input
                type="text"
                name="pickup_location"
                value={form.pickup_location}
                onChange={handleChange}
                placeholder="Kenyatta University"
                required
                className="w-full border rounded-lg px-4 py-3"
              />

            </div>


            <div>

              <label className="block text-sm font-medium mb-2">
                Delivery Address
              </label>

              <input
                type="text"
                name="delivery_address"
                value={form.delivery_address}
                onChange={handleChange}
                placeholder="Nairobi CBD"
                required
                className="w-full border rounded-lg px-4 py-3"
              />

            </div>


            <div className="md:col-span-2">

              <label className="block text-sm font-medium mb-2">
                Package Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the package"
                rows="3"
                className="w-full border rounded-lg px-4 py-3"
              />

            </div>


            <div className="md:col-span-2">

              <button
                type="submit"
                disabled={creating}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {creating
                  ? 'Creating...'
                  : 'Create Delivery'}
              </button>

            </div>

          </form>

        </section>


        {/* Deliveries */}

        <section className="bg-white rounded-xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-xl font-semibold">
                My Deliveries
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Deliveries created by your store.
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

          ) : deliveries.length === 0 ? (

            <div className="text-center py-10">

              <p className="text-gray-500">
                No deliveries yet.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {deliveries.map(delivery => (

                <div
                  key={delivery.id}
                  className="border rounded-xl p-5"
                >

                  <div className="flex flex-col md:flex-row md:justify-between gap-4">

                    <div>

                      <p className="text-sm text-gray-500">
                        Order
                      </p>

                      <h3 className="text-lg font-bold">
                        {delivery.order_number}
                      </h3>

                    </div>


                    <span className="self-start px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                      {delivery.status_display}
                    </span>

                  </div>


                  <div className="grid md:grid-cols-2 gap-4 mt-5">

                    <div className="bg-gray-50 p-4 rounded-lg">

                      <p className="text-xs text-gray-500 uppercase">
                        Pickup
                      </p>

                      <p className="font-medium mt-1">
                        {delivery.pickup_location}
                      </p>

                    </div>


                    <div className="bg-gray-50 p-4 rounded-lg">

                      <p className="text-xs text-gray-500 uppercase">
                        Destination
                      </p>

                      <p className="font-medium mt-1">
                        {delivery.delivery_address}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  )
}


export default RetailerDashboard