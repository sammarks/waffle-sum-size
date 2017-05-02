const BASE_URL = 'https://api.waffle.io'
const request = require('request-promise')
const moment = require('moment')
const _ = require('lodash')

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

const filterCards = (cards, startDate, endDate, user) => {
  return cards.filter((card) => {
    if (card.githubMetadata.state !== 'closed') return false
    const assignees = card.githubMetadata.assignees.map((assignee) => assignee.login)
    if (assignees.length <= 0) return false
    if (user && assignees.indexOf(user) === -1) return false
    const closedAt = moment(card.githubMetadata.closed_at)
    if (closedAt.isBefore(startDate)) return false
    if (closedAt.isAfter(endDate)) return false
    return true
  })
}

const outputMessage = (validCards) => {
  const sum = _.sum(_.map(validCards, (card) => card.size)) || 0
  return `Total Size: ${sum} across ${validCards.length} cards`.green
}

module.exports = { getProjects, getCardsForProject, filterCards, outputMessage }
