import { axios } from '..';

export const userLogin = async (payload: {
  username: string; password: string
}): Promise<any> => {
  try {
    const endPoint = '/token/';
    const res = await axios.post<any>(endPoint, payload);
    if (!res?.data) throw 'Something went wrong';
    return res.data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const GetUser = async (): Promise<any> => {
  try {
    const endPoint = '/user/current/';
    const res = await axios.get<any>(endPoint);
    if (!res?.data) throw 'Something went wrong GetUser';
    // console.log('GetUser>>', res.data);
    return res.data;
  } catch (err) {
    console.log('error get user', err);
    return Promise.reject(err);
  }
};
export const UserSubscriber = async (): Promise<any> => {
  try {
    const endPoint = '/user/current/';
    const res = await axios.post<any>(endPoint);
    if (!res?.data) throw 'Something went wrong GetUser';
    // console.log('GetUser>>', res.data);
    return res.data;
  } catch (err) {
    console.log('error get user', err);
    return Promise.reject(err);
  }
};
export const signup = async (values: any): Promise<any> => {
  try {
    const endPoint = '/signup/';
    const res = await axios.post<any>(endPoint, {
      ...values,
      email: values.email.toLowerCase(),
      username: values.username.toLowerCase(),
    });
    if (!res?.data) throw 'Something went wrong GetUser';
    // console.log('GetUser>>', res.data);
    return res.data;
  } catch (err) {
    console.log('error get user', err);
    return Promise.reject(err);
  }
};
export const postUser= async (payload: any,id:string|number): Promise<any> => {
  try {
    const endPoint = 'account/'+id+'/';
    const res = await axios.patch<any>(endPoint, payload, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
    if (!res?.data) throw 'Something went wrong';
    return res.data;
  } catch (err) {
    return Promise.reject(err);
  }
};
export const GetSingleUser = async (id: any): Promise<any> => {
  try {
    const endPoint = 'users/' + id + '/';
    const res = await axios.get<any>(endPoint);
    if (!res?.data) throw 'Something went wrong GetUser';
    // console.log('GetUser>>', res.data);
    return res.data;
  } catch (err) {
    console.log('error get user', err);
    return Promise.reject(err);
  }
};