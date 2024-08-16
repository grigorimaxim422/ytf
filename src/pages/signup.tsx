import React, { useEffect, useState } from 'react';
import { Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/reducer';
import { signup } from '../api/apiCalls/user';
import {useTranslation} from "react-i18next";

const SignUp: React.FC = () => {
     const {t} =useTranslation()
  const [createForm] = Form.useForm();
  const router = useNavigate();
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useSelector(selectUser);


  useEffect(() => {
    if (isAuthenticated) {
        router('/');
    }
  }, [isAuthenticated]);

  const register = async () => {
    try {
      setLoading(true);
      createForm
        .validateFields()
        .then(async (values) => {
          const res = await signup(values);
          if (res) {
            message.success(t('Signup_Success'));
            router('/login/');
          }
        })
        .catch((err: any) => {
          let error = t('please_fill');
          for (const el in err.response?.data) {
            if (el === 'detail') {
              error = err.response.data[el];
            } else {
              const name = el.charAt(0).toUpperCase() + el.slice(1);
              error = `${name}: ${err.response.data[el]?.join()}`;
            }
            break;
          }
          message.error(error);
        });
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className={'d-flex justify-center max-w-[450px] mx-auto mt-[40px]'}>
      <div className={'text-center text-primary text-[23px] mb-5 '}>
          {t('signup')}
      </div>
      <p className={'text-center text-[#6E6E6E] mb-8'}>
          {t('already_have_account')}
        <button
          className={'text-primary ml-1'}
          onClick={() => {
            router('/login');
          }}>
          {t('login')}
        </button>
      </p>
      <Form
        form={createForm}
        name="basic"
        layout="vertical"
        initialValues={{ remember: true }}
        autoComplete="off">
        <Form.Item
          name="first_name"
          className={'mb-8'}
          rules={[
            { required: true, message: t('required') },
          ]}>
          <Input
            className={
              'bg-transparent border-[#4A4A4A] focus:border-primary hover:border-primary h-[44px]'
            }
            placeholder={t('first_name')}
          />
        </Form.Item>
        <Form.Item
          name="last_name"
          className={'mb-8'}
          rules={[{ required: true, message: t('required') }]}>
          <Input
            className={
              'bg-transparent border-[#4A4A4A] focus:border-primary hover:border-primary h-[44px]'
            }
            placeholder={t('last_name')}
          />
        </Form.Item>
        <Form.Item
          name="username"
          className={'mb-8'}
          rules={[{ required: true, message: t('required') }]}>
          <Input
            className={
              'bg-transparent border-[#4A4A4A] focus:border-primary hover:border-primary h-[44px]'
            }
            placeholder={t('Username')}
          />
        </Form.Item>
        <Form.Item
          className="mb-8"
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
              message: t('required'),
            },
          ]}>
          <Input
            className={
              'bg-transparent border-[#4A4A4A] focus:border-primary hover:border-primary h-[44px]'
            }
            placeholder={t('Email')}
          />
        </Form.Item>
        <Form.Item
          className="mb-8"
          name="password"
          rules={[{ required: true, message: t('required') }]}>
          <Input.Password
            className={
              'bg-transparent border-[#4A4A4A] focus:border-primary hover:border-primary h-[44px]'
            }
            placeholder={t('Password')}
          />
        </Form.Item>
        <Form.Item
          className="mb-8"
          name="password2"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: t('required'),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t('confirm_password_mismatch'))
                );
              },
            }),
          ]}>
          <Input.Password
            className={
              'bg-transparent border-[#4A4A4A] focus:border-primary hover:border-primary h-[44px]'
            }
            placeholder={t('Confirm_Password')}
          />
        </Form.Item>
        <button
          className={
            'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-600 w-full h-[44px] font-bold rounded-[12px]'
          }
          disabled={loading}
          onClick={() => register()}>
          {t('signup')}
        </button>
      </Form>
    </div>
  );
};

export default SignUp;
