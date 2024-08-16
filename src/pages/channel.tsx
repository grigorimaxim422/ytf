import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {getVideo} from '../api/apiCalls/video';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {Avatar, Modal} from 'antd';
import SubscribeButton from '../components/SubscribeButton';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/reducer';
import VideoHomeCard from '../components/VideoHomeCard';
import {GetSingleUser} from '../api/apiCalls/user';
import {UserOutlined} from "@ant-design/icons";
import ChannelEdit from "../components/channelEdit";
import {useTranslation} from "react-i18next";


export default function Channel() {
    const router = useNavigate();
    const {id} = useParams();
    const [video, setVideos] = useState<[]>([]);
    const [currentUser, setCUser] = useState<any>(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const {isAuthenticated, user} = useSelector(selectUser);
    const [editModal, setEditModal] = useState<boolean>(false)
    const {t} = useTranslation();
    useEffect(() => {
        if (!id) return router('/');
    }, [id]);
    const getVideos = async (cPage?: number) => {
        try {
            const params = {
                page: cPage ? cPage : page,
                author: id
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

        if (id) {
            getCUser()
            getVideos();
        }
    }, [id]);
    const getCUser = async () => {
        try {
            const res = await GetSingleUser(id);
            setCUser(res);
        } catch (e) {

        }
    };
    const getMoreVideo = async () => {
        if (hasMore) {
            setPage(page + 1);
        }
        getVideos(page + 1);
    };
    return (
        <div className="Page">
            <div className={'flex flex-col gap-[20px]'}>
                {isAuthenticated && currentUser && currentUser.id === user.id && !user.channel_name ?
                    <div className={'text-center flex flex-col gap-[20px]'}>
                        <Modal open={true} title={t('manage_channel')} footer={false}
                               onCancel={() => router('/')}>
                            <ChannelEdit closeModal={() => setEditModal(false)}/>
                        </Modal>

                    </div>
                    : currentUser && <div>
                    <Modal open={editModal} title={t('manage_channel')}
                           footer={false}
                           onCancel={() => setEditModal(false)}>
                        <ChannelEdit closeModal={() => setEditModal(false)}/>
                    </Modal>
                    <div className={''}>
                        {currentUser.background &&
                            <div style={{
                                backgroundImage: `url(${currentUser.background})`,
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                            }}
                                 className={'h-[230px] bg-white rounded-[12px] mb-5'}
                            >
                            </div>
                        }
                        <div className={'flex justify-between gap-[10px] items-center flex-wrap'}>
                            <div className={'flex gap-[16px] items-center'}>
                                <div>
                                    <Avatar size={84} icon={<UserOutlined/>} src={currentUser.avatar}/>
                                </div>
                                <div className={''}>
                                    <div
                                        className={'text-[30px]'}>{currentUser.channel_name}</div>
                                    <div className={'flex flex-wrap items-center gap-[10px]'}>
                                        <strong>@{currentUser.channel_handle_name} </strong>
                                        <p>{currentUser.subscribers_count} {t('subscribers')} </p>
                                        <p>{total} {t('videos')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={'flex items-center gap-2'}>
                                {isAuthenticated && currentUser.id !== user.id &&
                                    <SubscribeButton author={currentUser} getSVideoStat={getCUser}/>
                                }
                                {isAuthenticated && currentUser.id === user.id &&
                                    <button onClick={() => setEditModal(true)}
                                            className={'border py-2 px-3 rounded-[12px] bg-white dark:bg-black font-bold'}>
                                        {t('manage_channel')}
                                    </button>
                                }
                            </div>
                        </div>
                        <p className={'px-5 py-5'}>{currentUser.description}</p>
                    </div>
                    <div className={' h-[100vh] overflow-auto no-scrollbar'}>
                        <hr/>
                        <div className={'my-3 text-[16px] text-primary'}>{t('videos')}</div>
                        <hr className={'mb-3'}/>
                        <InfiniteScroll
                            dataLength={video.length}
                            next={getMoreVideo}
                            hasMore={hasMore}
                            loader={<h3>...</h3>}
                            endMessage={<h4 className={'text-center my-5'}>{t('nothing')}</h4>}
                        >
                            <div className={'grid lg:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-[16px]'}>
                                {video.map((data: any) => (
                                    <div key={data.id}>
                                        <VideoHomeCard
                                            data={data}
                                        />
                                    </div>
                                ))}
                            </div>
                        </InfiniteScroll>
                    </div>
                </div>
                }

            </div>
        </div>
    );
}
