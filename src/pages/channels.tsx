import React, {useEffect, useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {Avatar} from 'antd';
import SubscribeButton from '../components/SubscribeButton';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/reducer';
import {UserOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";


export default function Channels() {
    const router = useNavigate();
    const {subscribers} = useSelector(selectUser);
     const {t} = useTranslation();
    return (
        <div className="Page">
            <div className={'flex flex-col gap-[20px] max-w-[800px] mx-auto'}>
                {subscribers && subscribers.map((user: any) => (
                    <div className={'flex justify-between gap-[10px] items-center flex-wrap'}
                         key={user.id}>
                        <div className={'flex gap-[20px] items-center'}>
                            <div>
                                <Avatar size={84} icon={<UserOutlined/>} src={user.avatar}/>
                            </div>
                            <div className={''}>
                                <div
                                    className={'text-[30px]'}>{user.channel_name}</div>
                                <div className={'flex flex-wrap items-center gap-[10px]'}>
                                    <strong>@{user.channel_handle_name} </strong>.
                                    <p>{user.subscribers_count} {t('subscribers')} </p>
                                </div>
                                <p className={'line-clamp-2'}>{user.description}</p>
                            </div>
                        </div>
                        <div className={'flex items-center gap-2'}>
                            <SubscribeButton author={user} getSVideoStat={()=>{}}/>
                        </div>
                    </div>
                ))}


            </div>
        </div>
    )
        ;
}
