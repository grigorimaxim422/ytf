import React, {useEffect, useState} from 'react';
import {deleteItem, getVideo} from '../api/apiCalls/video';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {Table, TableColumnsType, Pagination, message, Modal} from 'antd';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/reducer';
import VideoShowCard from "../components/VideoShowCard";
import TimeAgo from 'javascript-time-ago';
import ChannelEdit from "../components/channelEdit";
import {useTranslation} from "react-i18next";

const timeAgo = new TimeAgo('kr-KR');
export default function ChannelContent() {
    const router = useNavigate();
    const [video, setVideos] = useState<[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const {isAuthenticated, user} = useSelector(selectUser);
    const [editModal, setEditModal] = useState<boolean>(false)
    const {t} = useTranslation();

    const getVideos = async (cPage?: number) => {
        try {
            const params = {
                page: cPage ? cPage : page,
                author: user?.id
            };
            const res = await getVideo(params);
            if (!res.next) {
                setHasMore(false);
            }
            if (res) {
                setTotal(res.count)
            }
            let allVideo = {}
            Object.assign(allVideo, {[page]: res.results});
            let mapVideo: any[] = [];
            Object.values(allVideo).forEach((val: any) => {
                mapVideo = mapVideo.concat(val);
            });
            // @ts-ignore
            setVideos(mapVideo);
        } catch (e) {

        }
    };
    useEffect(() => {
        if (user.id) {
            getVideos(page);
        }
    }, [user.id, page]);


    const deleteVideo = async (videoId: number) => {
        try {
            const res = await deleteItem('videos/' + videoId + '/');
            if (res) {
                message.success('video deleted')
                setTimeout(() => {
                    router('/')
                }, 3000)

            }
        } catch (e) {
        }
    };
    const columns: TableColumnsType<any> = [
        {
            title: t('Video'),
            dataIndex: 'video',
            render: (value, record, index) => <VideoShowCard
                thumbnail={record.thumbnail}
                title={record.title}
                description={record.description}
                id={record.id}
            />,
        },
        {
            title: t('Visibility'),
            dataIndex: 'status',
        },
        {
            title: t('Date'),
            dataIndex: 'created_at',
            render: (value, record, index) => <div>{timeAgo.format(new Date(record.created_at))}</div>,
        }, {
            title: t('Views'),
            dataIndex: 'views_count',
        }, {
            title: t('Likes'),
            dataIndex: 'likes_count',
        }, {
            title: '',
            dataIndex: 'date',
            render: (value, record, index) => <div className={'flex gap-[12px]'}>
                <button className={
                    'px-3 h-[34px] font-bold rounded-[8px] border border-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }
                        onClick={() => {
                            if (window.confirm(t('delete_sure'))) {
                                deleteVideo(record.id)
                            }
                        }}
                >삭제
                </button>
                {/*<button className={*/}
                {/*    'px-3 h-[34px] font-bold rounded-[8px] border border-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'*/}
                {/*}>Edit*/}
                {/*</button>*/}
            </div>,
        },
    ];
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };
    return (
        <div className="Page">
            <div className={'flex flex-col gap-[20px]'}>
                {user && !user.channel_name ?
                    <div className={'text-center flex flex-col gap-[20px]'}>
                        <Modal open={true} title={t('manage_channel')} footer={false}
                               onCancel={() => router('/')}>
                            <ChannelEdit closeModal={() => setEditModal(false)}/>
                        </Modal>

                    </div>
                    : <div>
                        <div className={' h-[100vh] overflow-auto no-scrollbar'}>

                            <div className={'my-3 text-[18px] font-semibold'}>{t('channel_content')}</div>
                            <hr className={'mb-3'}/>
                            <Table
                                // rowSelection={{
                                //     ...rowSelection,
                                // }}
                                columns={columns}
                                dataSource={video}
                                pagination={false}
                            />
                            <div className={'text-right my-2'}>
                                <Pagination defaultCurrent={page} total={total}/>
                            </div>

                        </div>
                    </div>
                }

            </div>
        </div>
    );
}
