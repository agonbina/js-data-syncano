import axios from 'axios'

const pullIdsForReferences = (record, keys) => {
  keys.forEach(key => {
    const object = record[key]
    record[key] = object.value
  })
  return record
}

class Adapter {

  constructor ({ apiKey, instance }) {
    if (!apiKey) {
      throw new Error('You must provide an apiKey')
    }
    this.http = axios.create({
      baseURL: `https://api.syncano.io/v1.1/instances/${instance}/`,
      headers: {
        'X-API-KEY': apiKey
      },
      params: {
        excluded_fields: 'channel,channel_room,links,revision'
      }
    })
  }

  create (definition, attrs, options) {
    // TODO: implement
  }

  find (definition, id, options) {
    const { basePath, endpoint, name, relationList } = definition

    const url = basePath
      ? `${basePath}${endpoint}/${id}/`
      : `/classes/${name}/objects/${id}/`

    const localKeys = relationList
      .filter(relation => relation.localKey)
      .map(relation => relation.localKey)

    const config = {
      transformResponse: [data =>
        pullIdsForReferences(JSON.parse(data), localKeys)]
    }

    return this.http.get(url, config).then(response => response.data)
  }

  findAll (definition, params, options) {
    const { basePath, endpoint, name, relationList } = definition
    const localKeys = relationList
      .filter(relation => relation.localKey)
      .map(relation => relation.localKey)

    const url = basePath
      ? `${basePath}${endpoint}/`
      : `/classes/${name}/objects/`

    const config = {
      transformResponse: [data => {
        const { objects } = JSON.parse(data)
        const records = objects.map(record =>
          pullIdsForReferences(record, localKeys))

        return records
      }]
    }

    return this.http.get(url, config).then(response => response.data)
  }

  update (definition, id, attrs, options) {
    // TODO: implement
  }

  updateAll (definition, attrs, params, options) {
    // TODO: implement
  }

  destroy (definition, id, options) {
    const { endpoint, basePath } = definition

    const url = basePath
      ? `${basePath}${endpoint}/${id}/`
      : `/classes/${endpoint}/objects/${id}/`

    return this.http.delete(url)
  }

  login (username, password) {
    if (this.getSession()) {
      this.logout()
    }
    return this.http.post('/user/auth/', { username, password })
      .then(({ data }) => {
        this.setHeader('X-User-Key', data.user_key).setSession(data)
        return Promise.resolve(data)
      })
  }

  logout () {
    this.unsetHeader('X-User-Key').unsetSession()
  }

  register (username, password) {
    if (this.getSession()) {
      this.logout()
    }

    return this.http.post('/users/', { username, password })
      .then(({ data }) => {
        this.setHeader('X-User-Key', data.user_key).setSession(data)
        return Promise.resolve(data)
      })
  }

  // Helpers

  setHeader (header, value) {
    this.http.defaults.headers[header] = value
    return this
  }

  unsetHeader (header) {
    delete this.http.defaults.headers[header]
    return this
  }

  setSession (data) {
    global.sessionStorage.setItem('user', JSON.stringify(data))
    return this
  }

  getSession () {
    return JSON.parse(global.sessionStorage.getItem('user'))
  }

  unsetSession () {
    global.sessionStorage.removeItem('user')
    return this
  }

}

export default Adapter
