module.exports = {
  _200(data = {}) {
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  },
  _201(data = {}) {
    return {
      statusCode: 201,
      body: JSON.stringify(data),
    };
  },
  _400(data = {}) {
    return {
      statusCode: 400,
      body: JSON.stringify(data),
    };
  },
};
