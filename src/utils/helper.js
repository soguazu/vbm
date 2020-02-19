import axios from 'axios';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import Cryptr from 'cryptr';

import winston from '../config/winston';
import config from '../config/config';
import MESSAGES from './message';

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

export const decryptEmail = (payload) => cryptr.decrypt(payload);

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
  const data = {
    recipientEmail: 'soguauz@gmail.com',
    messageBody: verifyEmailPayload.htmlEmailPayload,
    subject: verifyEmailPayload.SUBJECT,
  };

  const option = {
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      VFDBankAuth: process.env.API_KEY,
    },
  };
  await axios.post(url, data, option);

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
