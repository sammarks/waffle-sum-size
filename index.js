const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const request = require('request')
const optionDefinitions = require('./options')
const chrono = require('chrono-node')
const moment = require('moment')
const { getProjects, getCardsForProject, filterCards, outputMessage } = require('./waffle')
const q = require('q')
const _ = require('lodash')
require('colors')

// Parse options.
let options = {}
try {
  options = commandLineArgs(optionDefinitions)
  if (!options.token) {
    throw new Error('Authorization token is required.')
  }
} catch (e) {
  console.error(e.message.red)
  console.log(require('./usage'))
  process.exit(1)
}

// Parse times if specified.
let startDate = moment()
let endDate = moment()
if (options['start-date']) {
  startDate = moment(chrono.parseDate(options['start-date']))
  if (!startDate.isValid()) {
    console.log('Start date is invalid.'.red)
    process.exit(1)
  }
}
if (options['end-date']) {
  endDate = moment(chrono.parseDate(options['end-date']))
  if (!endDate.isValid()) {
    console.log('End date is invalid.'.red)
    process.exit(1)
  }
}

// Prepare other options.
const authToken = options.token
const usernames = options.username

// Actually run the script.
console.log('Fetching projects...'.yellow)
getProjects(authToken).then((projects) => {
  return q.all(projects.map((project) => {
    console.log(`Fetching cards for project '${project.name}'...`.yellow)
    return getCardsForProject(authToken, project._id)
  }))
}).then((projectCards) => {
  const allCards = _.flatten(projectCards)
  if (usernames && usernames.length > 0) {
    usernames.forEach((username) => {
      const validCards = filterCards(allCards, startDate, endDate, username)
      console.log(`${username}: ${outputMessage(validCards)}`)
    })
    const validCards = filterCards(allCards, startDate, endDate)
    console.log(`Total: ${outputMessage(validCards)}`)
  } else {
    const validCards = filterCards(allCards, startDate, endDate)
    console.log(outputMessage(validCards))
  }
})
