module.exports = serialize;

function _serializeObject(object, mapping) {
  var serialized = {};
  for (var field in mapping.properties) {
    var val = serialize.call(object, object[field], mapping.properties[field]);
    if (val !== undefined) {
      serialized[field] = val;
    }
  }
  return serialized;
}

function serialize(model, mapping) {
  if (mapping.properties && model) {
    if (Array.isArray(model)) {
      return model.map(function(object) {
        return _serializeObject(object, mapping);
      });
    } else {
      return _serializeObject(model, mapping);
    }
  } else if (typeof value === 'object' && value !== null) {
    var name = value.constructor.name;
    if (name === 'ObjectID') {
      return value.toString();
    } else if (name === 'Date') {
      return new Date(value).toJSON();
    }
  } else {
    if (mapping.cast && typeof(mapping.cast) !== 'function')
      throw new Error('es_cast must be a function');
    model = mapping.cast ? mapping.cast.call(this, model) : model;
    if (typeof model === 'object' && model !== null) {
      var name = model.constructor.name;
      if (name === 'ObjectID') {
        return model.toString();
      } else if (name === 'Date') {
        return new Date(model).toJSON();
      }
      return model;
    } else {
      return model;
    }
  }
}
