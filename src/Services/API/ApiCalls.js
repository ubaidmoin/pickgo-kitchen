// import axios, {get} from 'axios';
// import {settings as s} from '../Settings';

// const getUrl = (ep) => `${s.baseUrl}${ep}`;

// export const getData = async (relativeUrl) => {
//   const url = getUrl(relativeUrl);
//   const options = {
//     mode: 'no-cors',
//     headers: {
//       // Authorization: `Bearer ${user.token}`,
//       'Content-Type': 'application/json',
//       Accept: '*/*',
//     },
//   };
//   try {
//     const response = await get(url, options).then((res) => res);
//     return {status: response.status, data: response.data};
//   } catch (err) {
//     if (err.response) {
//       return {status: err.response.status, data: []};
//     }
//     return {status: 0, data: []};
//   }
// };

// export const authService = async (relativeUrl, data) => {
//   const url = getUrl(relativeUrl);
//   const config = {
//     method: 'post',
//     url,
//     headers: {
//       'Content-Type': 'application/json-patch+json',
//       Accept: '*/*',
//     },
//     data,
//   };

//   try {
//     const response = await axios(config)
//       .then((res) => res)
//       .catch((error) => error);
//     console.log(response);
//     return response;
//     // eslint-disable-next-line no-empty
//   } catch (err) {}
// };

// export const postData = async (relativeUrl, data) => {
//   const url = getUrl(relativeUrl);
//   const config = {
//     method: 'post',
//     url,
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: '*/*',
//     },
//     data,
//   };

//   try {
//     const response = await axios(config)
//       .then((res) => res)
//       .catch((error) => error);
//     return response;
//   } catch (err) {
//     return {status: null};
//   }
// };

// export const postFile = async (relativeUrl, user, data) => {
//   const url = getUrl(relativeUrl);
//   const headers = {
//     Authorization: `Bearer ${user.token}`,
//   };
//   const response = await fetch(url, {
//     method: 'POST',
//     headers,
//     body: data,
//   })
//     .then((res) => res.json())
//     .then((res) => res)
//     .catch((error) => error);

//   return response;
// };

// export const putData = async (relativeUrl, data) => {
//   const url = getUrl(relativeUrl);
//   const config = {
//     method: 'put',
//     url,
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: '*/*',
//     },
//     data,
//   };
//   try {
//     const response = await axios(config)
//       .then((res) => res)
//       .catch((error) => error);
//     return response;
//   } catch (err) {
//     return {status: null};
//   }
// };

// export const deleteData = async (relativeUrl, user) => {
//   const url = getUrl(relativeUrl);

//   const options = {
//     headers: {
//       Authorization: `Bearer ${user.token}`,
//       'Content-Type': 'application/json-patch+json',
//       Accept: '*/*',
//     },
//   };

//   try {
//     const response = await axios
//       .delete(url, options)
//       .then((res) => res)
//       .catch((error) => error);
//     return response;
//   } catch (err) {
//     return {status: null};
//   }
// };
