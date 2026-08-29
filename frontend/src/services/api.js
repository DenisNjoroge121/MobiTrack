const API_URL = 'http://127.0.0.1:8000/api'

export async function login(username, password) {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.non_field_errors?.[0] ||
      data.detail ||
      'Login failed'
    )
  }

  return data
}


export async function getDeliveries(token) {
  const response = await fetch(`${API_URL}/deliveries/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch deliveries')
  }

  return response.json()
}


export async function getRiders(token) {
  const response = await fetch(`${API_URL}/riders/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch riders')
  }

  return response.json()
}


export async function createDelivery(token, deliveryData) {
  const response = await fetch(`${API_URL}/deliveries/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(deliveryData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail || 'Failed to create delivery'
    )
  }

  return data
}


export async function acceptDelivery(token, deliveryId) {
  const response = await fetch(
    `${API_URL}/deliveries/${deliveryId}/accept/`,
    {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.error || 'Failed to accept delivery'
    )
  }

  return data
}


export async function rejectDelivery(token, deliveryId) {
  const response = await fetch(
    `${API_URL}/deliveries/${deliveryId}/reject/`,
    {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.error || 'Failed to reject delivery'
    )
  }

  return data
}


export async function assignRider(token, deliveryId, riderId) {
  const response = await fetch(
    `${API_URL}/deliveries/${deliveryId}/assign/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        rider_id: riderId,
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.error || 'Failed to assign rider'
    )
  }

  return data
}


export async function updateDeliveryStatus(
  token,
  deliveryId,
  newStatus
) {
  const response = await fetch(
    `${API_URL}/deliveries/${deliveryId}/status/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.error || 'Failed to update delivery status'
    )
  }

  return data
}

export async function getCurrentUser(token) {
  const response = await fetch(
    `${API_URL}/auth/me/`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail || 'Failed to get user information'
    )
  }

  return data
}

export async function trackDelivery(orderNumber) {
  const response = await fetch(
    `http://127.0.0.1:8000/api/deliveries/track/${encodeURIComponent(orderNumber)}/`
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.error || 'Unable to track delivery.'
    )
  }

  return data
}