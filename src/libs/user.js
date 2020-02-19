import User from '../models/user';

const userLib = {};

userLib.create = async (payload) => {
  const user = await User.create({
    email: payload.Email,
    name: payload.Name,
    clientId: payload['Client ID'],
    phone: payload.Phone,
  });

  return user;
};
export default userLib;
