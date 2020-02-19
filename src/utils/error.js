const responseBuilder = async ({ status, message, data, statusCode }) => ({
  success: status,
  message,
  statusCode,
  data,
});

export default responseBuilder;
