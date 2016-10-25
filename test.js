var axios = require('axios')

const client = axios.create({
  baseURL: 'https://api.syncano.io/v1/instances/polished-resonance-8467',
  headers: {
    'X-API-KEY': '884c3500a0948db3936408f3f4649d0a03c2b543'
  }
})

client.get('/groups/', {
  params: {
    label: { '_contains': 'unit' }
  },
  data: {
    query: { label: { '_contains': 'unit' } }
  }
}).then(response => {
  console.log(response.data)
}).catch(error => {
  console.error(error)
})
