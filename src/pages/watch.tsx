'use client';
import React, {useEffect, useRef, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {deleteItem, getSingleVideo, getSingleVideoStat, getVideo, postVideoSingle} from '../api/apiCalls/video';
import VideoHomeCard from '../components/VideoHomeCard';
import {useNavigate, Link, useSearchParams} from 'react-router-dom';
import ReactPlayer from 'react-player';
import {Avatar, Empty, message, Spin} from 'antd';
import Icons from '../config/icon';
import TimeAgo from 'javascript-time-ago';
import SubscribeButton from '../components/SubscribeButton';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/reducer';
import Comment from '../components/Comment';
import {UserOutlined} from "@ant-design/icons";
import VideoSkeleton from "../components/videoSkeleton";
import {useTranslation} from "react-i18next";
import {filePath2} from "../api/axios";

const timeAgo = new TimeAgo('kr-KR');

export default function Watch() {
    const router = useNavigate();
    const [searchParams] = useSearchParams();
    const videoId: string | null = searchParams.get('v');
    const [video, setVideos] = useState<[]>([]);
    const [currentVideo, setCVideo] = useState<any>(null);
    const [currentVideoStat, setCVideoStat] = useState<any>(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    // const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [loading, setLoading] = useState(false);
    const {isAuthenticated, user} = useSelector(selectUser);
    const {t} = useTranslation()

    useEffect(() => {
        if (!videoId) return router('/');

        const localStorageVolume = localStorage.getItem('volume');

        if (localStorageVolume) {
            // const value = +JSON.parse(localStorageVolume);
            // if (value >= 0 && value <= 1) setVolume(value);
        }

        setIsMuted(localStorage.getItem('volume') === 'true');
    }, []);
    const shareVideo = () => {
        window.navigator.clipboard.writeText(window.location.href).then(() => {
            message.success(t('copied'));
        });
    };
    const getVideos = async (cPage: number | undefined) => {
        try {
            const params = {
                page: cPage ? cPage : page,
            };
            const res = await getVideo(params);
            if (res) {
                if (cPage) {
                    setPage(cPage)
                }
                if (!res.next) {
                    setHasMore(false);
                }
                let allVideo = [...video, ...res.results];
                const mapVideo: any[] = [];
                allVideo.filter(function (item) {
                    var i = mapVideo.find((x: any) => x.id == item.id);
                    if (!i && item.id !== parseInt(videoId as string)) {
                        mapVideo.push(item);
                    }
                    return null;
                });
                // @ts-ignore
                setVideos(mapVideo);
            }
        } catch (e) {

        }
    };
    const getSVideo = async () => {
        try {
            setLoading(true)
            const res = await getSingleVideo(videoId);
            setCVideo(res);
            setLoading(false)
        } catch (e) {

        }
    };
    const getSVideoStat = async () => {
        try {
            const res = await getSingleVideoStat(videoId);
            setCVideoStat(res.data);
        } catch (e) {

        }
    };
    useEffect(() => {
        getVideos(1);
    }, [videoId]);
    useEffect(() => {
        if (videoId) {
            getSVideo();
            getSVideoStat();
        }
    }, [videoId]);
    const getMoreVideo = async () => {
        if (hasMore) {
            getVideos(page + 1);
        }

    };
    const like = async () => {
        try {
            const formData = new FormData();
            formData.append('id', videoId as string);
            const res = await postVideoSingle('videos/like/', formData);
            if (res) {
                getSVideoStat();
            }
        } catch (e) {
            console.log(e);
        }
    };
    const dislike = async () => {
        try {
            const formData = new FormData();
            formData.append('id', videoId as string);
            const res = await postVideoSingle('videos/dislike/', formData);
            if (res) {
                getSVideoStat();
            }
        } catch (e) {
        }
    };
    const deleteVideo = async () => {
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


    return (
        <div className="Page">
            <div className={'flex flex-col xl:flex-row gap-[20px]'}>
                <div className={'basis-3/4'}>
                    {loading ? <div className={'flex justify-center'}><Spin className={'mx-auto'}/></div> :
                        currentVideo && <div className={'rounded-[8px] overflow-hidden'}>
                            <ReactPlayer

                                width="100%"
                                height="100%"
                                url={filePath2(currentVideo.video)}
                                controls
                                volume={isMuted?0:0.6}
                                muted={isMuted}
                                playsinline={true}
                                onEnded={() => {
                                    // @ts-ignore
                                    video && video.length > 0 && router(`/watch?v=${video[0].id}`);
                                }
                                }>
                                {/*<source src={currentVideo.video} type="video/mp4" />*/}
                            </ReactPlayer>
                        </div>
                    }
                    {currentVideoStat && <div>
                        <div className="flex flex-row mt-2 gap-2  justify-between">
                            <div className="flex flex-col">
                                <p className="font-semibold text-[24px]">
                                    {currentVideoStat.title}
                                </p>
                                <p className="text-gray-400 dark:text-gray-100 text-[16px] mt-1">

                                    {/* {currentVideoStat.views_count==0?`${t('views')} ${currentVideoStat.views_count}`:`${currentVideoStat.views_count} ${t('views')}`}  */}
                                    {`${t('views')} ${currentVideoStat.views_count}`} 
                                    . {timeAgo.format(new Date(currentVideoStat.created_at))}</p>
                            </div>
                            {isAuthenticated &&
                                <div className={'flex items-center gap-[10px]'}>
                                    <div onClick={() => like()}
                                         className={'flex items-center gap-[10px] cursor-pointer ' + (currentVideoStat && currentVideoStat.is_liked ? 'fill-primary' : '')}>
                                        <Icons name={'thumbup'}/> {currentVideoStat && currentVideoStat.likes_count}
                                    </div>
                                    <div onClick={() => dislike()}
                                         className={'flex items-center gap-[10px] cursor-pointer ' + (currentVideoStat && currentVideoStat.is_disliked ? 'fill-primary' : '')}>
                                        <Icons
                                            name={'thumbdown'}/> {currentVideoStat && currentVideoStat.dislikes_count}
                                    </div>
                                    <button onClick={shareVideo} className={'border py-1 px-2 rounded-[12px] bg-white dark:bg-black'}>
                                         {t('share')}
                                    </button>
                                    {isAuthenticated && user.id === currentVideoStat.author.id &&
                                        <button onClick={() => {
                                            if (window.confirm(t('delete_sure'))) {
                                                deleteVideo()
                                            }
                                        }} className={'border py-1 px-2 rounded-[12px] bg-white dark:bg-black'}>
                                            {t('delete')}
                                        </button>
                                    }
                                    {/*<IconButton>*/}
                                    {/*  <MoreHoriz/>*/}
                                    {/*</IconButton>*/}
                                </div>
                            }
                        </div>
                        <div className="flex flex-row mt-2 gap-2 justify-between">
                            <div className="flex gap-[16px] items-center">
                                <Avatar size={54} icon={<UserOutlined/>} src={currentVideoStat.author?.avatar}/>
                                <div>
                                    <Link to={`/channel/${currentVideoStat.author?.id}`}>

                                        <div
                                            className={'text-primary text-[18px]'}>{currentVideoStat.author?.username}</div>
                                    </Link>
                                    <div> {t('subscribers')}  {currentVideoStat.author?.subscribers_count}</div>
                                </div>

                            </div>
                            {isAuthenticated &&
                                <div className={'flex items-center gap-[10px]'}>
                                    <SubscribeButton author={currentVideoStat.author} getSVideoStat={getSVideoStat}/>
                                </div>
                            }
                        </div>
                        <div className={'py-2'}>
                            <strong>{t('description')}:</strong><br/>
                            {currentVideoStat.description}
                        </div>
                        <Comment videoId={currentVideoStat?.id}/>
                    </div>

                    }
                </div>
                <div className={'basis-1/4 h-[100vh] overflow-auto no-scrollbar'}>
                    <InfiniteScroll
                        dataLength={video.length}
                        next={getMoreVideo}
                        hasMore={hasMore}
                        loader={<VideoSkeleton single={true}/>}
                        endMessage={<h4 className={'text-center my-5'}>
                            {/* <Empty description={
                            <span>
      {t('nothing')}
      </span>
                        } /> */}
                        </h4>}
                    >
                        <div className={'grid grid-cols-1 gap-[16px]'}>
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
        </div>
    );
}
