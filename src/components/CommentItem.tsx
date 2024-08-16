import React, {useEffect, useState} from 'react';
import {deleteItem, getCommentReplies, postReply, postVideoSingle} from '../api/apiCalls/video';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/reducer';
import {Avatar, Form, Input, message} from 'antd';
import Icons from "../config/icon";
import {
    CaretDownFilled, CaretUpFilled, UserOutlined
} from '@ant-design/icons';
import TimeAgo from 'javascript-time-ago';
import ko from 'javascript-time-ago/locale/ko';
import {useTranslation} from "react-i18next";

TimeAgo.addDefaultLocale(ko);
const timeAgo = new TimeAgo('ko-KR');

interface Props {
    comment: any;
    getC: () => void
}

const CommentItem: React.FC<Props> = ({comment, getC}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState<[]>([]);
    const [has_reply, setHasReply] = useState(false)
    const [form_reply, setFormReply] = useState(false)
    const {isAuthenticated, user} = useSelector(selectUser);
    const {t} = useTranslation();
    const getR = async () => {
        try {
            const res = await getCommentReplies(comment.id);
            // @ts-ignore
            setComments(res.data);
        } catch (e) {

        }
    };
    const reply = async () => {
        form
            .validateFields()
            .then(async (values) => {
                values.comment = comment.id;
                const res: any = await postReply(values);
                getC();
                form.resetFields()
                setFormReply(false)
            })
            .catch(() => message.error('Please fill all fields'));
    };
    useEffect(() => {
        if (has_reply) {
            getR();
        }
    }, [has_reply]);

    const like = async () => {
        try {
            const res = await postVideoSingle('comments/like/', {id: comment.id});
            if (res) {
                getC()
            }

        } catch (e) {
            console.log(e);
        }
    };
    const dislike = async () => {
        try {

            const res = await postVideoSingle('comments/dislike/', {id: comment.id});
            if (res) {
                getC()
            }
        } catch (e) {
            console.log(e);
        }
    };
    const rlike = async (id: number) => {
        try {
            const res = await postVideoSingle('reply-comments/like/', {id: id});
            if (res) {
                getR()
            }

        } catch (e) {
            console.log(e);
        }
    };
    const rdislike = async (id: number) => {
        try {

            const res = await postVideoSingle('reply-comments/dislike/', {id: id});
            if (res) {
                getR()
            }
        } catch (e) {
            console.log(e);
        }
    };
    const deleteComment = async () => {
        try {

            await deleteItem('comments/' + comment.id + '/');
            getC()
        } catch (e) {
            console.log(e);
        }
    };
    const deleteReply = async (id: number) => {
        try {

            const res = await deleteItem('reply-comments/' + id + '/');
            await getC()
            await getR()
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <>
            {comment &&
                <div className={'mt-2'}>
                    <div className={'flex gap-[16px]'}>
                        <div>
                            <Avatar size={44} icon={<UserOutlined/>} src={comment.author?.avatar}/>
                        </div>
                        <div>
                            <strong>@{comment.author?.username}</strong>
                            <small className={'ml-2'}>{timeAgo.format(new Date(comment.created_at))}</small><br/>
                            <p>{comment.content}</p>
                        </div>
                    </div>

                    <div className={'flex gap-[10px] pl-[55px]'}>
                        {isAuthenticated &&
                            <div className={'flex items-center gap-[10px] my-3'}>
                                <div onClick={() => like()}
                                     className={'flex items-center gap-[10px] cursor-pointer ' + (comment && comment.is_liked ? 'fill-primary' : '')}>
                                    <Icons name={'thumbup'}/> {comment && comment.likes_count}
                                </div>
                                <div onClick={() => dislike()}
                                     className={'flex items-center gap-[10px] cursor-pointer ' + (comment && comment.is_disliked ? 'fill-primary' : '')}>
                                    <Icons name={'thumbdown'}/> {comment && comment.dislikes_count}
                                </div>
                            </div>
                        }
                        <div className={'flex gap-[10px] items-center'}>
                            {isAuthenticated && <button onClick={() => setFormReply(true)}
                                                        className={'py-1 px-3'}>
                                 {t('reply')}
                            </button>}
                            {isAuthenticated && comment.author.id === user.id &&
                                <button onClick={() => deleteComment()}
                                        className={'py-1 px-3 ml-1'}>
                                    {t('delete')}
                                </button>}
                        </div>
                    </div>
                    {(comment.reply_count > 0 || form_reply) && <>
                        <button onClick={() => setHasReply(!has_reply)}
                                className={`text-primary py-1 px-3 rounded-[12px] ml-[45px] mt-2 ${has_reply ? 'border-primary' : ''}`}>
                            {has_reply ? <CaretUpFilled/> : <CaretDownFilled/>} {comment.reply_count} {t('replies')}
                        </button>
                        {form_reply &&
                            <Form
                                form={form}
                                name="basic"
                                layout="vertical"
                                initialValues={{remember: true}}
                                autoComplete="off">
                                <Form.Item
                                    name="content"
                                    label=""
                                    rules={[{required: true}]}>
                                    <Input.TextArea
                                        className={
                                            'text-black bg-transparent  focus:border-primary hover:border-primary h-[44px] mt-3'
                                        }
                                        placeholder={t('type_your_reply')}
                                    />
                                </Form.Item>
                                <button
                                    className={
                                        'bg-primary px-8 h-[36px] font-bold rounded-[12px] hover:bg-blue-700 text-white'
                                    }
                                    disabled={loading}
                                    onClick={() => reply()}
                                >
                                    {t('reply')}
                                </button>
                                <button
                                    className={
                                        'bg-white dark:bg-black px-8 h-[36px] font-bold rounded-[12px] hover:bg-blue-700 ml-2'
                                    }
                                    onClick={() => setFormReply(false)}
                                >
                                    {t('cancel')}
                                </button>
                            </Form>
                        }
                        {has_reply && <>
                            <div className={'flex flex-col gap-[16px] ml-[55px]'}>
                                {comments.map((data: any) => (
                                    <div key={data.id} className={'my-2'}>
                                        <div className={'flex gap-[16px]'}>
                                            <div>
                                                <Avatar size={44} icon={<UserOutlined/>} src={data.author?.avatar}/>
                                            </div>
                                            <div>
                                                <strong>@{data.author?.username}</strong>
                                                <small
                                                    className={'ml-2'}>{timeAgo.format(new Date(data.created_at))}</small><br/>
                                                <p>{data.content}</p>
                                            </div>
                                        </div>
                                        <div className={'flex gap-[10px] ml-2'}>
                                            {isAuthenticated &&
                                                <div className={'flex items-center gap-[10px] my-3'}>
                                                    <div onClick={() => rlike(data.id)}
                                                         className={'flex items-center gap-[10px] cursor-pointer ' + (data && data.is_liked ? 'fill-primary' : '')}>
                                                        <Icons name={'thumbup'}/> {data && data.likes_count}
                                                    </div>
                                                    <div onClick={() => rdislike(data.id)}
                                                         className={'flex items-center gap-[10px] cursor-pointer ' + (data && data.is_disliked ? 'fill-primary' : '')}>
                                                        <Icons name={'thumbdown'}/> {data && data.dislikes_count}
                                                    </div>
                                                </div>
                                            }
                                            {isAuthenticated && data.author.id === user.id &&
                                                <button onClick={() => deleteReply(data.id)}
                                                        className={'py-1 px-3 ml-1'}>
                                                    {t('delete')}
                                                </button>}
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </>
                        }
                    </>
                    }
                </div>
            }
        </>

    )
        ;
};
export default CommentItem;