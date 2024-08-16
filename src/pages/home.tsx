import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {getVideo} from '../api/apiCalls/video';
import VideoHomeCard from '../components/VideoHomeCard';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/reducer';
import {useTranslation} from "react-i18next";
import {Empty} from "antd";
import VideoSkeleton from "../components/videoSkeleton";
import {useSearchParams} from "react-router-dom";

export default function Home() {
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search')
    const {t} = useTranslation();
    const [video, setVideos] = useState<[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const {categories} = useSelector(selectUser);
    const [category, setCategory] = useState('');
    const getVideos = async (cPage?: number) => {
        try {
            const params = {
                page: cPage ? cPage : page,
                search: search,
                category: category,
            };
            const res = await getVideo(params);

            if (!res.next) {
                setHasMore(false);
            }

            if (page === 1) {
                setVideos(res.results);
            } else {
                let allVideo = {}
                Object.assign(allVideo, {[page]: res.results});
                let mapVideo: any[] = [];
                Object.values(allVideo).forEach((val: any) => {
                    mapVideo = mapVideo.concat(val);
                });
                // @ts-ignore
                setVideos(mapVideo);
            }
        } catch (e) {

        }
    };
    useEffect(() => {
        setPage(1);
        getVideos();
    }, [category, search]);
    const getMoreVideo = async () => {
        if (hasMore) {
            setPage(page + 1);
        }
        getVideos(page + 1);
    };


    return (
        <div className="Page">
            <div className={'flex flex-wrap gap-[16px] mb-5 '}>
                <button
                    className={`py-1 px-3 rounded-[8px]  ${category === '' ? 'bg-black text-white dark:bg-white dark:text-black' : 'dark:text-black dark:bg-neutral-600 bg-neutral-100 hover:bg-neutral-200'}`}
                    onClick={() => {
                        setCategory('');
                    }}>
                    { t('All') }
                </button>
                {categories && categories.map((c: any) => (
                    <button key={c.id}
                            className={`py-1 px-3 rounded-[8px]  ${category === c.id ? 'bg-black text-white dark:bg-white dark:text-black' : 'dark:text-black dark:bg-neutral-600 bg-neutral-100 hover:bg-neutral-200'}`}
                            onClick={() => {
                                setCategory(c.id);
                            }}>{t(c.name)}</button>
                ))}
            </div>

            <InfiniteScroll
                dataLength={video.length}
                next={getMoreVideo}
                hasMore={hasMore}
                loader={<VideoSkeleton/>}
                endMessage={<h4 className={'text-center my-5'}>
                    {/* <Empty description={
                    <span className={'dark:text-white'}>
      {t('nothing')}
      </span>
                } /> */}
                </h4>}
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
    )
        ;
}
