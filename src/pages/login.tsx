import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, message } from "antd";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/reducer";
import { useUser } from "../hooks";
import { useTranslation } from "react-i18next";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [createForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useNavigate();
  const { isAuthenticated } = useSelector(selectUser);
  const { login } = useUser();

  useEffect(() => {
    if (isAuthenticated) {
      router("/");
    }
  }, [isAuthenticated]);

  const loginS = async () => {
    try {
      setLoading(true);
      createForm
        .validateFields()
        .then(async (values) => {
          const loginD = {
            username: values.username.toLowerCase(),
            password: values.password,
          };
          const res = await login(loginD);

          if (!res) return;
        })
        .catch((e: any) => {
          if (e.response?.data?.detail) {
            message.error(e.response.data.detail);
          } else {
            message.error("login error");
          }
        });
      setLoading(false);
    } catch (e) {
      message.error("Please fill all fields");
      setLoading(false);
    }
  };

  return (
    <div className={"d-flex justify-center max-w-[450px] mx-auto mt-[40px]"}>
      <div
        className={"text-center text-primary text-[38px] mb-1 font-semibold"}
      >
        {t("login")}
      </div>
      <p className={"text-center text-[#6E6E6E] mb-8"}>
        {/* {t('Dont have an account?')} */}
        {t('already_have_account')}
        <button
          className={"text-primary ml-1"}
          onClick={() => {
            router("/signup");
          }}
        >
          {t("signup")}
        </button>
      </p>
      <Form
        form={createForm}
        name="basic"
        layout="vertical"
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item
          className="mb-8"
          name="username"
          rules={[{ required: true, message: t('required') }]}
        >
          <Input
            className={
              "text-black bg-transparent border-[#4A4A4A] focus:border-primary hover:border-primary h-[44px]"
            }
            placeholder={t("Username")}
          />
        </Form.Item>
        <Form.Item
          className="mb-8"
          name="password"
          rules={[{ required: true, message: t('required') }]}
        >
          <Input.Password
            className={
              "text-black bg-transparent border-[#4A4A4A] focus:border-primary hover:border-primary h-[44px]"
            }
            placeholder={t("Password")}
          />
        </Form.Item>

        <button
          className={
            "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-600 w-full h-[44px] font-bold rounded-[12px]"
          }
          disabled={loading}
          onClick={() => loginS()}
        >
          {t("login")}
        </button>
      </Form>
    </div>
  );
};

export default Login;
