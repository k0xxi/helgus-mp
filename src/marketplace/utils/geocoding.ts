/**
 * OpenStreetMap Nominatim Geocoding Service
 *
 * Converts addresses (street, zip, city, country) to coordinates (latitude, longitude)
 * for proximity search functionality.
 *
 * Rate Limits:
 * - Max 1 request per second
 * - User-Agent header required
 *
 * Docs: https://nominatim.org/release-docs/latest/api/Search/
 */

export interface GeocodingResult {
  latitude: number
  longitude: number
  displayName: string
}

export interface GeocodingError {
  type: 'RATE_LIMIT' | 'NOT_FOUND' | 'NETWORK_ERROR' | 'INVALID_INPUT'
  message: string
}

export interface GeocodingResponse {
  result?: GeocodingResult
  error?: GeocodingError
}

// Rate limiting: max 1 request per second
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1000 // 1 second in milliseconds

/**
 * Geocode an address using OpenStreetMap Nominatim API
 *
 * @param params - Address components (street and city are optional, zip and country required)
 * @returns { result, error } - Either coordinates or error description
 */
export async function geocodeAddress(params: {
  street?: string
  zip: string
  city?: string
  country: string
}): Promise<GeocodingResponse> {
  const { street, zip, city, country } = params

  // Validate input (only zip and country are required)
  if (!zip || !country) {
    return {
      error: {
        type: 'INVALID_INPUT',
        message: 'PLZ und Land sind erforderlich für Geocoding'
      }
    }
  }

  // Rate limiting: ensure min 1 second between requests
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    )
  }
  lastRequestTime = Date.now()

  // Build address query string
  // Format: "street, zip city, country" or "zip, country" if city not provided
  const zipCityPart = city ? `${zip} ${city}` : zip
  const addressParts = [street, zipCityPart, country].filter(Boolean)
  const addressQuery = addressParts.join(', ')

  // Construct Nominatim API URL
  const searchParams = new URLSearchParams({
    q: addressQuery,
    format: 'json',
    limit: '1',
    addressdetails: '1'
  })

  const url = `https://nominatim.openstreetmap.org/search?${searchParams}`

  try {
    const response = await fetch(url, {
      headers: {
        // User-Agent header is REQUIRED by Nominatim
        'User-Agent': 'HelgusMarketplace/1.0 (https://helgus.at)'
      }
    })

    // Handle rate limiting
    if (response.status === 429) {
      return {
        error: {
          type: 'RATE_LIMIT',
          message: 'Zu viele Anfragen. Bitte warte einen Moment und versuche es erneut.'
        }
      }
    }

    // Handle HTTP errors
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // Parse response
    const data = await response.json()

    // Handle no results
    if (!data || data.length === 0) {
      return {
        error: {
          type: 'NOT_FOUND',
          message:
            'Adresse konnte nicht gefunden werden. Bitte überprüfe deine Eingaben.'
        }
      }
    }

    // Extract coordinates from first result
    const result = data[0]
    return {
      result: {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        displayName: result.display_name
      }
    }
  } catch (error) {
    console.error('Geocoding network error:', error)
    return {
      error: {
        type: 'NETWORK_ERROR',
        message:
          'Netzwerkfehler beim Geocoding. Bitte versuche es später erneut.'
      }
    }
  }
}

/**
 * Calculate distance between two geographic coordinates using Haversine formula
 *
 * @param lat1 - Latitude of first point (degrees)
 * @param lon1 - Longitude of first point (degrees)
 * @param lat2 - Latitude of second point (degrees)
 * @param lon2 - Longitude of second point (degrees)
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers

  // Convert degrees to radians
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

/**
 * Convert degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}
