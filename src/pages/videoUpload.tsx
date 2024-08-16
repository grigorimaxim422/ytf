import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/reducer';
import {
    Form,
    Input,
    Select,
    Upload,
    message,
    UploadFile,
    UploadProps,
    Steps,
    Tabs,
    Modal,
    Radio,
    Space,
    Switch, Collapse
} from 'antd';
import type {RcFile,} from 'antd/es/upload/interface';
import {postVideo} from '../api/apiCalls/video';
import ImgCrop from "antd-img-crop";
import {useTranslation} from "react-i18next";

const VideoUpload: React.FC = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [fileList2, setFileList2] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const router = useNavigate();
    const {isAuthenticated, categories} = useSelector(selectUser);
    const {t} = useTranslation()

    useEffect(() => {
        if (!isAuthenticated) {
            router('/');
        }
    }, [isAuthenticated]);
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const props2: UploadProps = {
        onRemove: (file) => {
            const index = fileList2.indexOf(file);
            const newFileList = fileList2.slice();
            newFileList.splice(index, 1);
            setFileList2(newFileList);
        },
        beforeUpload: (file) => {
            setFileList2([...fileList2, file]);
            return false;
        },
        fileList,
    };
    const handleSubmit = () => {
        form
            .validateFields()
            .then(async (values) => {
                console.log(values)
                const formData = new FormData();
                formData.append('title', values.title);
                formData.append('description', values.description);
                formData.append('category', values.category);
                formData.append('status', values.status ? values.status : 'Public');
                formData.append('video', fileList2[0] as RcFile);
                console.log(fileList[0], fileList2[0])
                if (fileList[0]) {
                    formData.append('thumbnail', fileList[0].originFileObj as RcFile);
                }
                const res: any = await postVideo(formData);
                if (res) {
                    router(`/watch?v=${res.id}`);
                }
            })
            .catch(() => message.error('Please fill all fields'));
    };

    const steps = [
        {
            title: t('details')
        },
        {
            title: t('video_elements')
        },
        {
            title: t('Checks')
        },
        {
            title: t('Visibility')
        }
    ];
    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    const items = steps.map((item) => ({key: item.title, title: item.title}));
    const generateVideoThumbnail = (file: any) => {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            const video = document.createElement("video");

            // this is important
            video.autoplay = true;
            video.muted = true;
            video.src = URL.createObjectURL(file);

            video.onloadeddata = () => {
                let ctx = canvas.getContext("2d");

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                video.pause();
                return resolve(canvas.toDataURL("image/png"));
            };
        });
    };

    const onChangeThumb: UploadProps['onChange'] = ({fileList: newFileList}) => {
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
    const onChange = async (checked: boolean) => {
        if (checked && fileList2 && fileList2[0]) {
            const b64: any = await generateVideoThumbnail(fileList2[0])

            const res = await fetch(b64)
            const blob: Blob = await res.blob()
            const file = new File([blob], 'thumb.png', {type: 'image/png'})
            const inputDom: any = document.getElementById('thumbInput')
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            if (inputDom) {
                inputDom.files = dataTransfer.files
                inputDom.dispatchEvent(new Event('change', {bubbles: true}));
            }

        }
    };

    return (
        <Modal open={true}
               footer={false}
               width={800}
               onCancel={() => router('/')}
        >
            <div
                className={
                    'text-primary text-[28px] font-semibold'
                }>
                {t('upload_video')}
            </div>
            <hr/>
            <Steps current={current} items={items} labelPlacement="vertical" className={'custom-step my-[70px]'}/>
            <div className={'max-h-[45vh] overflow-auto no-scrollbar px-3'}>
                <Form
                    form={form}
                    name="basic"
                    layout="vertical"
                    className={'max-h-[45vh] min-h-[45vh]'}
                    initialValues={{remember: true}}
                    autoComplete="off">
                    <div className={current === 0 ? '' : 'absolute top-[-200vh]'}>
                        <h6 className={'font-semibold text-[20px]'}>{t('Details')}</h6>
                        <div className={'flex gap-[12px]'}>

                            <div
                                className={
                                    'basis-2/3'
                                }>
                                <Form.Item name="title" label={t('video_title')} rules={[{required: true,message: t('required')}]}>
                                    <Input
                                        className={
                                            'bg-transparent  focus:border-primary hover:border-primary h-[44px]'
                                        }
                                        placeholder={t('video_title')}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="description"
                                    label={t("description")}
                                    rules={[{ required: true,message: t('required') }]}
                                >
                                    <Input.TextArea
                                        className={
                                            'bg-transparent  focus:border-primary hover:border-primary h-[44px]'
                                        }
                                        placeholder={t('tell_viewers')}
                                    />
                                </Form.Item>
                                <Form.Item name="category" label={t("Category")} rules={[{required: true,message: t('required')}]}>
                                    <Select
                                        placeholder={t("select")}
                                        className={
                                            'bg-transparent  focus:border-primary hover:border-primary h-[44px]'
                                        }>
                                        {categories && categories.map((cat: any, idx: number) => (
                                            <Select.Option value={cat.id} key={idx}>
                                                {t(cat.name)}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label={t("Thumbnail")}>
                                    <small>{t("set_a_thumbnail")}</small><br/>
                                    <small>{t("upload_the_video")}</small><br/>
                                    <div className={'flex mt-1'}>
                                        <Switch onChange={onChange}
                                                defaultValue={false}
                                                disabled={fileList2 && fileList2.length === 0}
                                                className={'mb-5'}/>
                                        <div className={'px-3'}>{t("auto_generate")}</div>
                                    </div>
                                    <Form.Item
                                        name="thumbnail"
                                        valuePropName="fileList"
                                        getValueFromEvent={normFile}
                                    >
                                        <ImgCrop aspect={16 / 9}>
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
                                                id={'thumbInput'}
                                                onChange={onChangeThumb}
                                                onPreview={onPreview}
                                            >
                                                <p className="ant-upload-drag-icon">{t("Thumbnail")}</p>
                                            </Upload>
                                        </ImgCrop>
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item name="playlists" label={t('Playlists')}>
                                    <small>{t('add_your_video')}</small>
                                    <Select
                                        placeholder={t('select')}
                                        className={
                                            'bg-transparent  focus:border-primary hover:border-primary h-[44px]'
                                        }>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="kids" label={t("Audience")}>
                                    <div>
                                        <small>{t('this_video_is')}<br/>
                                            {t('regardless_of_your')}
                                            <div className={'bg-neutral-100 dark:bg-neutral-700 p-3 my-3 rounded-md'}>
                                                {t('features_like')}
                                            </div>
                                        </small>
                                    </div>

                                    <Radio.Group defaultValue={1}>
                                        <Space direction="vertical">
                                            <Radio value={1}>{t('yes_kid')}</Radio>
                                            <Radio value={2}>{t('no_kid')}</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                                <Collapse ghost>
                                    <Collapse.Panel header={t('age_restriction')} key="1">
                                        <Form.Item name="age">
                                            <div className={''}>
                                                <small>{t('do_you_want')}<br/>

                                                    <span className={'opacity-[0.7] mb-5'}>
                                                    {t('age_restricted')}
                                                    </span>
                                                </small>
                                            </div>

                                            <Radio.Group defaultValue={1} className={'mt-5'}>
                                                <Space direction="vertical">
                                                    <Radio value={1}>{t('yes_18')}</Radio>
                                                    <Radio value={2}>{t('no_18')}</Radio>
                                                </Space>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Collapse.Panel>
                                </Collapse>
                                <small className={'opacity-[0.7] mb-5'}>
                                    {t('paid_promotion')}
                                </small>
                            </div>
                            <div
                                className={
                                    'basis-1/3 realtive'
                                }>

                                <Form.Item label={t('Video')} className={'sticky top-0'}>

                                    <Form.Item
                                        name="video"
                                        valuePropName="fileList"
                                        getValueFromEvent={normFile}
                                        rules={[{required: true}]}
                                        noStyle>
                                        <Upload.Dragger
                                            name="files"
                                            accept="video/*"
                                            maxCount={1}
                                            {...props2}>
                                            <p className="ant-upload-drag-icon">{t('Video')}</p>
                                            <small className="ant-upload-text">
                                                {t('drag')}
                                            </small>
                                        </Upload.Dragger>
                                    </Form.Item>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <div className={current === 1 ? '' : 'absolute top-[-200vh]'}>
                        <h6 className={'font-semibold text-[20px]'}>{t('video_elements')}</h6>
                        <p>{t('use_cards')}</p>
                        <div className={'bg-neutral-100 dark:bg-neutral-700 p-3 my-3 rounded-md opacity-[0.5]'}>
                            <h6 className={'font-semibold text-[18px]'}>{t('add_subtitles')}</h6>
                            <p>{t('reach_a_broader')}</p>
                        </div>
                        <div className={'bg-neutral-100 dark:bg-neutral-700 p-3 my-3 rounded-md opacity-[0.5]'}>
                            <h6 className={'font-semibold text-[18px]'}> {t('add_end_screen')}</h6>
                            <p>{t('promote_related_content')}</p>
                        </div>
                        <div className={'bg-neutral-100 dark:bg-neutral-700 p-3 my-3 rounded-md opacity-[0.5]'}>
                            <h6 className={'font-semibold text-[18px]'}>{t('add_cards')}</h6>
                            <p>{t('promote_related_video')}</p>
                        </div>

                    </div>
                    <div className={current === 2 ? '' : 'absolute top-[-200vh]'}>
                        <h6 className={'font-semibold text-[20px]'}>{t('Checks')}</h6>
                        <p>{t('we_check')}</p>
                        <div className={'flex justify-between'}>
                            <div>
                                <h6 className={'font-semibold text-[18px] mt-3'}> {t('Copyright')}</h6>
                                <p>{t('no_issue')}</p>
                            </div>
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" width={30}
                            >
                                <g className="style-scope tp-yt-iron-icon">
                                    <path d="M9,18.7l-5.4-5.4l0.7-0.7L9,17.3L20.6,5.6l0.7,0.7L9,18.7z" fill={'green'}
                                          className="style-scope tp-yt-iron-icon"></path>
                                </g>
                            </svg>
                        </div>


                        <hr className={'mt-3 mb-1'}/>
                        {t('remember_these')}
                    </div>
                    <div className={current === 3 ? '' : 'absolute top-[-200vh]'}>
                        <h6 className={'font-semibold text-[20px]'}>{t('Visibility')}</h6>
                        <p>{t('choose_when')}</p>
                        <div className={'border p-3 my-3 rounded-md'}>
                            <h6 className={'font-semibold text-[18px] mb-2'}>{t('save_or_publish')}</h6>
                            <p>{t('make_your_video')} <b>{t('Public')}</b>, <b>{t('Unlisted')}</b>, {t('or')} <b>{t('Private')}</b></p>
                            <Form.Item name="status" className={'mt-3'}>

                                <Radio.Group defaultValue={'Public'}>
                                    <Space direction="vertical">
                                        <Radio value={'Private'}>{t('Private')} <br/> <small>{t('only_you')}</small></Radio>
                                        <Radio value={'Unlisted'}>{t('Unlisted')} <br/> <small>{t('anyone_with')}</small></Radio>
                                        <Radio value={'Public'} defaultChecked>{t('Public')} <br/> <small>{t('everyone_can')}</small></Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>
                        </div>
                        <div className={'bg-neutral-100 dark:bg-neutral-700 p-3 my-3 rounded-md'}>
                            <h6 className={'font-semibold text-[16px] mb-2'}>{t('before_you')}</h6>
                            <p>
                                <h6 className={'mb-1 '}>{t('do_kids')}</h6>
                                <div className={'opacity-[0.8]'}>{t('make_sure')}
                                </div>
                                <h6 className={'mb-1 mt-3'}>{t('looking_for')}</h6>
                                <div className={'opacity-[0.8]'}>{t('our_community')}
                                </div>
                            </p>
                        </div>
                    </div>
                </Form>
            </div>
            <div style={{marginTop: 24}} className={'flex justify-end gap-[10px]'}>
                {current > 0 && (
                    <button onClick={() => prev()}
                            className={
                                'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 px-8 h-[44px] font-bold rounded-[12px]'
                            }
                    >
                        {t('Previous')}
                    </button>
                )}
                {current < steps.length - 1 && (
                    <button onClick={() => {
                        if (current === 0) {
                            form.validateFields().then(async (values) => {
                                if (fileList && fileList.length > 0) {
                                    next()
                                } else {
                                    message.error('Please upload thumbnail')
                                }
                            })
                                .catch(() => message.error('Please fill all fields'));
                        } else {
                            next()
                        }
                    }}
                            className={
                                'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 px-8 h-[44px] font-bold rounded-[12px]'
                            }
                    >
                        {t('Next')}
                    </button>
                )}
                {current === steps.length - 1 && (
                    <button onClick={() => handleSubmit()}
                            className={
                                'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 px-8 h-[44px] font-bold rounded-[12px]'
                            }
                    >
                        {t('submit')}
                    </button>
                )}

            </div>
        </Modal>
    );
};

export default VideoUpload;
