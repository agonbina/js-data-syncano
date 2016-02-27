import Syncano from 'syncano'

class Adapter {

  constructor ({ apiKey, instance }) {
    this.syncano = new Syncano({ apiKey, instance })
  }

  create (definition, attrs, options) {
    // TODO: implement
  }

  find (definition, id, options) {
    const { class: className, syncano = className } = definition
    return this.syncano.class(syncano).dataobject().detail(id)
  }

  findAll (definition, params, options) {
    const { class: className, syncano = className } = definition
    return this.syncano.class(syncano).dataobject()
      .list()
      .then(response => {
        return response.objects
      })
  }

  update (definition, id, attrs, options) {
    // TODO: implement
  }

  updateAll (definition, attrs, params, options) {
    // TODO: implement
  }

  destroy (definition, params, options) {
    // TODO: implement
  }

}

export default Adapter
