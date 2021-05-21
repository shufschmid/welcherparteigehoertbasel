/* eslint-disable no-console */
const fetch = require('node-fetch')

exports.handler = async (event, context) => {
  const eventData = event.body
  try {
    const url = JSON.parse(eventData).url
    const response = await fetch(url)
    const data = await response.json()
    return { statusCode: 200, body: JSON.stringify({ data }) }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'failed' }),
    }
  }
}