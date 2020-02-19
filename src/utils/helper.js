import axios from 'axios';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import Cryptr from 'cryptr';
import bcryptjs from 'bcryptjs';

import winston from '../config/winston';
import config from '../config/config';
import MESSAGES from './message';

import User from '../models/user';

const cryptr = new Cryptr(config.hashingSecret);
export const getUserInfo = async (accountNo) => {
  let response;
  const url = `https://devesb.vfdbank.systems:8263/vfd-agent/1.0/referral/enquiry?accountNo=${accountNo}`;

  const option = {
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      VFDBankAuth: process.env.API_KEY,
    },
  };

  try {
    response = await axios.get(url, option);
  } catch (error) {
    winston.error(error.message);
    return {
      error: error.message,
      statusCode: 404,
      message: 'Account not found',
    };
  }
  return response.data.Data;
};

export const getEmailTemplate = async () =>
  new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'mail.html'), (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  });

export const encryptEmail = (payload) => {
  const data = `${payload}~${new Date()}`;
  return cryptr.encrypt(data);
};

export const decryptEmail = (payload) => {
  let cleanPayload;
  try {
    cleanPayload = cryptr.decrypt(payload);
  } catch (error) {
    return {
      error: error.message,
      statusCode: 400,
      message: 'Invalid token',
    };
  }

  return cleanPayload;
};

export const hashPassword = (password) => bcryptjs.hash(password, 10);

export { hashPassword as default };

export const injectData = async (payload, pattern, type) => {
  const { whatToReplace } = payload;
  const whereToReplace = type === 'HTML' ? payload.HTML : payload.PLAIN;

  const res = whereToReplace.replace(
    pattern,
    (matched) => whatToReplace[matched],
  );

  return res;
};

export const generateEmailContent = async (name, query, content) => {
  const encryptedMail = encryptEmail(query);
  const whatToReplace = { '{name}': name, '{mail}': encryptedMail };
  const pattern = /{name}|{mail}/gi;
  const { SUBJECT, HTML, PLAIN } = MESSAGES[content];

  const payloadHTML = {
    HTML,
    whatToReplace,
  };
  const payloadPLAIN = {
    PLAIN,
    whatToReplace,
  };

  const mailPayload = await getEmailTemplate();

  const html = await injectData(payloadHTML, pattern, 'HTML');
  const plain = await injectData(payloadPLAIN, pattern, 'PLAIN');

  const htmlEmailPayload = mailPayload.replace(/{message}/gi, html);
  const plainEmailPayload = mailPayload.replace(/{message}/gi, plain);
  return {
    mail: query,
    htmlEmailPayload,
    plainEmailPayload,
    SUBJECT,
  };
};

export const sendEmail = async (userInformation) => {
  const { Email, Name } = userInformation;
  const url =
    'https://devesb.vfdbank.systems:8263/vfd-agent/1.0/referral/notify';

  const verifyEmailPayload = await generateEmailContent(Name, Email, 'VERIFY');
  // const data = {
  //   recipientEmail: 'soguazu@gmail.com',
  //   messageBody: verifyEmailPayload.htmlEmailPayload,
  //   subject: verifyEmailPayload.SUBJECT,
  // };

  const data = {
    recipientEmail: 'soguazu@gmail.com',
    messageBody: 'verifyEmailPayloadhtmlEmailPayload',
    subject: 'verifyEmailPayloadSUBJECT',
  };

  const option = {
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      VFDBankAuth: process.env.API_KEY,
    },
  };

  try {
    await axios.post(url, data, option);
  } catch (error) {
    return {
      error: error.message,
      statusCode: 500,
      message: `Mail sender error: ${error}`,
    };
  }

  return true;
};

export const getUserId = (Authorization) => {
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { id } = jwt.verify(token, config.hashingSecret);
    return id;
  }

  throw new Error('Not authenticated');
};

export const verifyAccount = async (mail) => {
  let user;
  const payload = decryptEmail(mail);

  if (payload.error) {
    return payload;
  }
  const strPayload = payload.split('~');

  const email = strPayload[0];
  const date = new Date(strPayload[1]);

  try {
    user = await User.findOne({
      where: {
        email,
      },
    });
  } catch (error) {
    return {
      error: error.message,
      statusCode: 404,
      message: 'User not found',
    };
  }

  const expectedDate = date.setDate(date.getDate() + 1);

  if (user && +new Date(expectedDate) >= +new Date()) return user;
  return false;
};
