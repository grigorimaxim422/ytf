import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/reducer';
import {Form, Input, Upload, message, UploadFile, UploadProps, Select} from 'antd';
import type {RcFile,} from 'antd/es/upload/interface';
import {GetSingleUser, postUser} from "../api/apiCalls/user";
import ImgCrop from 'antd-img-crop';
import Icons from "../config/icon";
import {useUser} from "../hooks";
import {useTranslation} from "react-i18next";

const UpdateProfle = ({closeModal}: { closeModal: () => void }) => {
    const router = useNavigate();
    const [currentUser, setCUser] = useState<any>(null);
    const {isAuthenticated, user} = useSelector(selectUser);
    const {getCurrentUser} = useUser();

    useEffect(() => {
        if (user) {
            getCUser()
        }
    }, [user]);
    const getCUser = async () => {
        try {
            const res = await GetSingleUser(user.id);
            setCUser(res);
            form.setFieldValue('description', res.description)
            form.setFieldValue('channel_name', res.channel_name)
            form.setFieldValue('channel_handle_name', res.channel_handle_name)
            form.setFieldValue('genre', res.genre)
            form.setFieldValue('phone_number', res.phone_number)
            setFileList([{
                uid: '1',
                name: 'image.png',
                status: 'done',
                url: res.avatar,
            }])
            setFileList2([{
                uid: '1',
                name: 'background.png',
                status: 'done',
                response: 'Server Error 500', // custom error message to show
                url: res.background,
            }])
        } catch (e) {

        }
    };
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [fileList2, setFileList2] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const {t} = useTranslation();

    const handleSubmit = () => {
        form
            .validateFields()
            .then(async (values) => {

                const formData = new FormData();
                formData.append('channel_name', values.channel_name);
                formData.append('channel_handle_name', values.channel_handle_name);
                formData.append('genre', values.genre);
                formData.append('phone_number', values.phone_number);
                formData.append('description', values.description);
                if (fileList[0] && fileList[0].uid !== '1') {
                    formData.append('avatar', fileList[0].originFileObj as RcFile);
                }
                if (fileList2[0] && fileList2[0].uid !== '1') {
                    formData.append('background', fileList2[0].originFileObj as RcFile);
                }

                const res: any = await postUser(formData, user.id);
                await getCurrentUser()
                closeModal()
            })
            .catch(() => message.error(t('please_fill')));
    };


    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const onChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
        setFileList(newFileList);
    };
    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as RcFile);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };
    const onChange2: UploadProps['onChange'] = ({fileList: newFileList}) => {
        setFileList2(newFileList);
    };

    const categories = [
        {title: t('music'), slug: 'music', icon: 'music'},
        {title: t('movie_tv'), slug: 'movie', icon: 'playlists'},
        {title: t('gaming'), slug: 'gaming', icon: 'gaming'},
        {title: t('news'), slug: 'news', icon: 'channel'},
        {title: t('sports'), slug: 'sports', icon: 'sports'},
        {title: t('courses'), slug: 'courses', icon: 'channel'},
    ]

    return (
        <div
        >
            <Form
                form={form}
                name="basic"
                layout="vertical"
                initialValues={{remember: true}}
                autoComplete="off">
                <div
                    className={
                        'grid grid-cols-1 gap-[8px] h-[65vh] no-scrollbar overflow-auto px-3'
                    }>
                    <Form.Item
                        label={t('channel_name')}
                        name="channel_name"
                        className={'mb-2'}
                        rules={[
                            {required: true, message: t('required')},
                        ]}>
                        <Input
                            className={
                                'bg-transparent  focus:border-primary hover:border-primary h-[44px]'
                            }
                            placeholder={t('channel_name')}
                        />
                    </Form.Item>
                    <Form.Item
                        label={t('channel_handler')}
                        name="channel_handle_name"
                        className={'mb-2'}
                        rules={[{required: true, whitespace: true, message: t('required')}]}>
                        <Input
                            prefix={'@'}
                            className={
                                'bg-transparent  focus:border-primary hover:border-primary h-[44px]'
                            }
                            placeholder={t('channel_handler')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={t('description')}
                        rules={[{required: true, message: t('required')}]}>
                        <Input.TextArea
                            className={
                                'bg-transparent  focus:border-primary hover:border-primary h-[44px]'
                            }
                            placeholder={t('description')}
                        />
                    </Form.Item>
                    <div className={'grid sm:grid-cols-2  grid-cols-1 gap-[8px]'}>
                        <Form.Item
                            label={t('contact_number')}
                            name="phone_number"
                            className={'mb-2'}
                            rules={[{required: true, message: t('required')}]}>
                            <Input
                                className={
                                    'bg-transparent  focus:border-primary hover:border-primary h-[44px]'
                                }
                                placeholder={t('contact_number')}
                            />
                        </Form.Item>
                        <Form.Item name="genre" label={t('category')}>
                            <Select
                                placeholder={t('select')}
                                className={
                                    'text-black bg-transparent  focus:border-primary hover:border-primary h-[44px]'
                                }>
                                {categories && categories.map((cat: any, idx: number) => (
                                    <Select.Option value={cat.slug} key={idx}>
                                        <div className={'flex items-start gap-[10px]'}><Icons
                                            name={cat.icon}/> {cat.title}</div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className={'grid sm:grid-cols-2  grid-cols-1 gap-[8px]'}>
                        <Form.Item label={t('avatar')}>
                            <Form.Item
                                name="avatar"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <ImgCrop aspect={1}>
                                    <Upload
                                        listType="picture-card"
                                        name="files"
                                        accept="image/*"
                                        fileList={fileList}
                                        maxCount={1}
                                        beforeUpload={(file) => {
                                            setFileList([...fileList, file]);
                                            return false;
                                        }}
                                        onChange={onChange}
                                        onPreview={onPreview}
                                    >
                                        <p className="ant-upload-drag-icon">{t('avatar')}</p>
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label={t('background')}>
                            <Form.Item
                                name="background"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                                noStyle>
                                <ImgCrop aspect={2.5}>
                                    <Upload
                                        listType="picture-card"
                                        name="files"
                                        accept="image/*"
                                        fileList={fileList2}
                                        maxCount={1}
                                        beforeUpload={(file) => {
                                            setFileList2([...fileList2, file]);
                                            return false;
                                        }}
                                        onChange={onChange2}
                                        onPreview={onPreview}
                                    >
                                        <p className="ant-upload-drag-icon">{t('background')}</p>
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>
                        </Form.Item>
                    </div>
                </div>
            </Form>
            <div className={'flex justify-end flex-wrap gap-3'}>
                <button
                    className={
                        'bg-neutral-100 dark:bg-neutral-600 hover:bg-neutral-200 px-8 h-[44px] font-bold rounded-[12px]'
                    }
                    disabled={loading}
                    onClick={() => handleSubmit()}>
                    {t('update')}
                </button>
                <button
                    className={
                        'border px-8 h-[44px] font-bold rounded-[12px]'
                    }
                    onClick={() => closeModal()}>
                    {t('cancel')}
                </button>
            </div>
        </div>
    );
};

export default UpdateProfle;