import axios, {get} from 'axios';
import {settings as s} from '../Settings';

const getUrl = (ep) => `${s.baseUrl}${ep}`;

export const getData = async (url) => {
  try {
    const response = await get(url).then((res) => res);
    return {status: response.status, data: response.data};
  } catch (err) {
    if (err.response) {
      return {status: err.response.status, data: []};
    }
    return {status: 0, data: []};
  }
};

export const authService = async (data) => {
  const config = {
    method: 'post',
    url: s.LOGIN,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  };
  try {
    console.log(config.url)
    const response = await axios(config)
      .then((res) => res)
      .catch((error) => error);
    return response;
  } catch (err) {
    return null;
  }
};

export const postData = async (url, data = null, isFormData = false) => {
  const config = {
    method: 'post',
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  };
  if (data) {
    config.body = isFormData ? data : JSON.stringify(data);
  }
  try {
    const response = await fetch(url, config)
      .then((res) => res.json())
      .then((res) => res)
      .catch((error) => error);
    return response;
  } catch (err) {
    return null;
  }
};

export const deleteData = async (url, data = null) => {
  const config = {
    method: 'delete',
    url,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (data) {
    config.data = JSON.stringify(data);
  }
  try {
    const response = await axios(config)
      .then((res) => res)
      .catch((error) => error);
    return response;
  } catch (err) {
    return null;
  }
};

export const postFile = async (relativeUrl, user, data) => {
  const url = getUrl(relativeUrl);
  const headers = {
    Authorization: `Bearer ${user.token}`,
  };
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: data,
  })
    .then((res) => res.json())
    .then((res) => res)
    .catch((error) => error);

  return response;
};

export const putData = async (relativeUrl, data) => {
  const url = getUrl(relativeUrl);
  const config = {
    method: 'put',
    url,
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
    data,
  };
  try {
    const response = await axios(config)
      .then((res) => res)
      .catch((error) => error);
    return response;
  } catch (err) {
    return {status: null};
  }
};
