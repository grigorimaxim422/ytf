import React, {useEffect, useState} from 'react';
import {Avatar, Skeleton} from 'antd';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import {UserOutlined} from "@ant-design/icons";
import SubscribeButton from "./SubscribeButton";
import {useSelector} from "react-redux";
import {selectUser} from "../redux/reducer";
import {axios} from "../api";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const ChannelList = ({slug}: { slug?: string }) => {
    const [channels, setChannels] = useState([])
    const {t} = useTranslation();
    const getChannels = async () => {
        try {
            const endPoint = 'users/';
            const params = {
                search: slug
            }
            const res = await axios.get<any>(endPoint, {params: params});
            setChannels(res.data.results)
        } catch (err) {
            console.log('error post wallet', err);
            return Promise.reject(err);
        }
    }
    useEffect(() => {
        if (slug) {
            getChannels()
        }
    }, [slug]);
    const router = useNavigate();
    return (
        <>
            {channels.length > 0 ?
                <Swiper className={'own-swiper'}
                        spaceBetween={70}
                        slidesPerView={'auto'}
                        navigation={true}
                        modules={[Navigation]}
                        onSlideChange={() => console.log('slide change')}
                >{channels && channels.map((user: any, i: number) => (
                    <SwiperSlide key={i}>
                        <div className={'flex justify-between gap-[10px] items-center flex-col px-12'}
                             key={user.id}>
                            <div className={'flex flex-col gap-[20px] items-center'}>
                                <div>
                                    <Avatar size={84} icon={<UserOutlined/>} src={user.avatar}/>
                                </div>
                                <div className={''}>
                                    <div onClick={()=>router('/channel/'+user.id)}
                                        className={'text-[16px] font-semibold cursor-pointer'}>
                                        {user.channel_name}
                                    </div>
                                    <div className={'text-center'}>
                                        <p>{user.subscribers_count} {t('subscribers')} </p>
                                    </div>
                                </div>
                            </div>
                            <div className={'flex items-center gap-2 mt-3'}>
                                <SubscribeButton author={user} getSVideoStat={() => getChannels()}/>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                </Swiper> :
                <div>{t('nodata')}</div>
            }
        </>
    );
};

export default ChannelList;
