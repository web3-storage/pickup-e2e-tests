import axios from 'axios'

export const addPin = async ({ cid }, context) => {
  try {

    const url = `${context.apiUrl}/pins/${cid}`
    const result = await axios.post(url, null, {
      headers: { 'Authorization': `Basic ${process.env.PICKUP_BASIC_AUTH_TOKEN}` }
    })
    return result.data
  } catch (e) {
    throw new Error(`Add Pin request error: ${JSON.stringify(e.response.data)}`)
  }
}

export const getPin = async ({ cid }, context) => {
  try {
    const url = `${context.apiUrl}/pins/${cid}`
    const result = await axios.get(url, {
      headers: { 'Authorization': `Basic ${process.env.PICKUP_BASIC_AUTH_TOKEN}` }
    })
    return result.data
  } catch (e) {
    throw new Error(`Get
     Pin request error: ${JSON.stringify(e.response.data)}`)
  }
}
