'use client';
import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {getComments, postComment} from '../api/apiCalls/video';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/reducer';
import {Form, Input, message} from 'antd';
import CommentItem from "../components/CommentItem";
import {useTranslation} from "react-i18next";

interface Props {
    videoId: string;
}

const Comment: React.FC<Props> = ({videoId}) => {
    const {t} =useTranslation()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState<[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [totalComment, setTotalComment] = useState(0);
    const [page, setPage] = useState(1);
    const { isAuthenticated } = useSelector(selectUser);
    const getC = async (cPage?: number) => {
        try {
            const params = {
                page: cPage ? cPage : page,
                video:videoId
            };
            const res = await getComments(params);
            if(res) {
                if(cPage) {
                    setPage(cPage)
                }
                setTotalComment(res.count)
                if (!res.next) {
                    setHasMore(false);
                }
                let allComment = {}
                Object.assign(allComment, {[page]: res.results});
                let mapComment: any[] = [];
                Object.values(allComment).forEach((val: any) => {
                    mapComment = mapComment.concat(val);
                });

                // @ts-ignore
                setComments(mapComment);
            }
        } catch (e) {

        }
    };
    const comment = async () => {
        form
            .validateFields()
            .then(async (values) => {
                values.video = videoId;
                const res: any = await postComment(values);
                await getC();
                form.resetFields()
            })
            .catch(() => message.error('Please fill all fields'));
    };
    useEffect(() => {
        getC(1);
    }, [videoId]);
    const getMoreVideo = async () => {
        if (hasMore) {
            getC(page + 1);
        }

    };
    return (
        <div className={'mt-2'}>
            <hr/>
            {isAuthenticated &&
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
                            'bg-transparent  focus:border-primary hover:border-primary h-[44px] mt-3'
                        }
                        placeholder={t('type_your_comment')}
                    />
                </Form.Item>
                <button
                    className={
                        'bg-primary px-8 h-[36px] font-bold rounded-[12px] hover:bg-blue-700 text-white'
                    }
                    disabled={loading}
                    onClick={() => comment()}
                >
                    {t('submit')}
                </button>
            </Form>
            }
            <hr className={'my-2'}/>
            <div className={'text-[20px] my-3'}>{totalComment} {t('comments')}:</div>
            <InfiniteScroll
                dataLength={comments.length}
                next={getMoreVideo}
                hasMore={hasMore}
                loader={<h3> Loading...</h3>}
                endMessage={<h4 className={'text-center my-5'}>{t('no_more_comments')}</h4>}
            >
                <div className={'flex flex-col gap-[16px]'}>
                    {comments.map((data: any) => (
                        <div key={data.id}>
                            <CommentItem comment={data} getC={() => getC()}/>
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    )
        ;
};
export default Comment;