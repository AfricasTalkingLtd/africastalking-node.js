function airtime ({ createAxiosInstance, endpoints, username }) {
  return {
    sendAirtimeRequest: data => {
      return createAxiosInstance().post(endpoints.SEND_AIRTIME, new URLSearchParams({
        ...data,
        username
      }).toString())
    },
    findTransactionStatus: transactionId => {
      return createAxiosInstance('application/json').get(endpoints.FIND_AIRTIME_TRANSACTION, {
        params: {
          transactionId,
          username
        }
      })
    }
  }
};

module.exports = airtime
