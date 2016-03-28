module.exports = {
  login: {
    post: {
      success: 200,
      fail: 403
    },
    get: {
      success: 200,
      fail: 419
    }
  },
  signup: {
    post: {
      success: 201,
      fail: 400
    }
  }
};