import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Avatar, Collapse} from 'antd';
import ChannelList from "../components/channelList";
import Icons from "../config/icon";
import {useTranslation} from "react-i18next";


export default function Subscriptions() {
    const {t} = useTranslation();
    let [searchParams] = useSearchParams();
    const type = searchParams.get("type")

    const s_items = [
        {title: t('music'), slug: 'music', icon: 'music'},
        {title: t('movie_tv'), slug: 'movie', icon: 'playlists'},
        {title: t('gaming'), slug: 'gaming', icon: 'gaming'},
        {title: t('news'), slug: 'news', icon: 'channel'},
        {title: t('sports'), slug: 'sports', icon: 'sports'},
        {title: t('courses'), slug: 'courses', icon: 'channel'},
    ]

    return (
        <div className="Page">
            <div className={'flex flex-col gap-[20px] mx-auto'}>
                <Collapse
                    bordered={false}
                    defaultActiveKey={[0, 1, 2, 3, 4, 5]}
                    style={{background: 'transparent'}}


                >
                    {type ? s_items.filter((s: any) => s.slug === type).map((s_item: any, idx: number) => (
                            <Collapse.Panel header={
                                <div className={'flex items-start font-semibold gap-[10px] text-[18px]'}>
                                    <Icons name={s_item.icon}/> {s_item.title}
                                </div>
                            } key={idx} showArrow={false} className={'py-4'}>
                                <ChannelList slug={s_item.slug}/>
                            </Collapse.Panel>
                        )) :
                        s_items.map((s_item: any, idx: number) => (
                            <Collapse.Panel header={
                                <div className={'flex items-start font-semibold gap-[10px] text-[18px]'}>
                                    <Icons name={s_item.icon}/> {s_item.title}
                                </div>
                            } key={idx} showArrow={false} className={'py-4'}>
                                <ChannelList slug={s_item.slug}/>
                            </Collapse.Panel>
                        ))}
                </Collapse>

            </div>
        </div>
    )
        ;
}
