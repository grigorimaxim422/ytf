import { axios } from '..';

export const getVideo = async (params: any): Promise<any> => {
  try {
    const endPoint = 'videos/';
    const res = await axios.get<any>(endPoint, { params: params });
    if (!res?.data) throw 'Something went wrong';
    return res.data;
  } catch (err) {
    console.log('error post wallet', err);
    return Promise.reject(err);
  }
};
export const getComments = async (params: any): Promise<any> => {
  try {
    const endPoint = 'comments/';
    const res = await axios.get<any>(endPoint, { params: params });
    if (!res?.data) throw 'Something went wrong';
    return res.data;
  } catch (err) {
    console.log('error post wallet', err);
    return Promise.reject(err);
  }
};
export const getCommentReplies = async (id: string): Promise<any> => {
  try {
    const endPoint = 'reply-comments/all/';
    const res = await axios.get<any>(endPoint, { params: {id:id} });
    if (!res?.data) throw 'Something went wrong';
    return res.data;
  } catch (err) {
    console.log('error post wallet', err);
    return Promise.reject(err);
  }
};
export const postComment = async (payload: any): Promise<any> => {
  try {
    const endPoint = 'comments/';
    const res = await axios.post<any>(endPoint, payload);
    if (!res?.data) throw 'Something went wrong';
    return res.data;
  } catch (err) {
    console.log('error post wallet', err);
    return Promise.reject(err);
  }
};
export const postReply = async (payload: any): Promise<any> => {
  try {
    const endPoint = 'reply-comments/';
    const res = await axios.post<any>(endPoint, payload);
    if (!res?.data) throw 'Something went wrong';
    return res.data;
  } catch (err) {
    console.log('error post wallet', err);
    return Promise.reject(err);
  }
};
export const getSingleVideo = async (id: string | null): Promise<any> => {
  try {
    const endPoint = 'videos/' + id + '/';
    const res = await axios.get<any>(endPoint);
    if (!res?.data) throw 'Something went wrong';
    return res.data;
  } catch (err) {
    console.log('error post wallet', err);
    return Promise.reject(err);
  }
};
export const getSingleVideoStat = async (id: string | null): Promise<any> => {
  try {
    const endPoint = 'videos/status/?id=' + id;
    const res = await axios.get<any>(endPoint);
    if (!res?.data) throw 'Something went wrong';
    return res.data;
  } catch (err) {
    console.log('error post wallet', err);
    return Promise.reject(err);
  }
};
export const postVideoSingle = async (url: string, payload: any): Promise<any> => {
  try {

    const res = await axios.post<any>(url, payload, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
    if (!res?.data) throw 'Something went wrong';
    return res.data;
  } catch (err) {
    console.log('error post wallet', err);
    return Promise.reject(err);
  }
};
export const getCategory = async (): Promise<any> => {
  try {
    const endPoint = 'categories/all/';
    const res = await axios.get<any>(endPoint);
    if (!res?.data) throw 'Something went wrong';
    return res.data;
  } catch (err) {
    console.log('error post wallet', err);
    return Promise.reject(err);
  }
};
export const postVideo = async (payload: any): Promise<any> => {
  try {
    const endPoint = 'videos/';
    const res = await axios.post<any>(endPoint, payload, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
    if (!res?.data) throw 'Something went wrong';
    return res.data;
  } catch (err) {
    console.log('error post wallet', err);
    return Promise.reject(err);
  }
};
export const subscribeChannel = async (payload: any): Promise<any> => {
  try {
    const endPoint = 'users/subscribe/';
    const res = await axios.post<any>(endPoint, payload );
    if (!res?.data) throw 'Something went wrong';
    return res.data;
  } catch (err) {
    console.log('error post wallet', err);
    return Promise.reject(err);
  }
};
export const deleteItem = async (url:string): Promise<any> => {
  try {
    const res = await axios.delete<any>(url);
    if (!res) throw 'Something went wrong';
    return true;
  } catch (err) {
    console.log('error post wallet', err);
    return Promise.reject(err);
  }
};
