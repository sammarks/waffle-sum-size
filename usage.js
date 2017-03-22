const commandLineUsage = require('command-line-usage')
const optionDefinitions = require('./options')

const sections = [
  {
    header: 'Waffle.io Sum Size',
    content: 'Given your Waffle.io authorization token (found in requests in your browser),' +
      ' sums the size of cards based on some filter criteria.'
  },
  {
    header: 'Synopsis',
    content: [
      '$ waffle-sum-size [underline]{authToken}'
    ]
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  },
  {
    header: 'Examples',
    content: [
      {
        desc: '1. Summing the size per-user across all projects',
        example: '$ waffle-sum-size --username john.doe authtoken'
      },
      {
        desc: '2. Summing the size per-user for the past two weeks',
        example: '$ waffle-sum-size --username john.doe --start-date "2 weeks ago" authtoken'
      }
    ]
  },
  {
    content: 'Project home: [underline]{https://github.com/sammarks/waffle-sum-size}'
  }
]

module.exports = commandLineUsage(sections)
