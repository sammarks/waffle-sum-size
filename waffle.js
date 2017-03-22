const BASE_URL = 'https://api.waffle.io'
const request = require('request-promise')

const makeRequest = (method, authorizationToken, endpoint, data = {}) => {
  const realMethod = method.toUpperCase()
  const options = {
    method: realMethod,
    headers: {
      'Authorization': `Bearer ${authorizationToken}`
    },
    json: true,
    url: `${BASE_URL}${endpoint}`
  }
  if (realMethod === 'GET') {
    options.qs = data
  } else {
    options.body = data
  }
  return request(options)
}

const getProjects = (authorizationToken) => {
  return makeRequest('GET', authorizationToken, '/user/projects')
}

const getCardsForProject = (authorizationToken, projectId) => {
  return makeRequest('GET', authorizationToken, `/projects/${projectId}/cards`)
}

module.exports = { getProjects, getCardsForProject }
