import React, {useContext, useState} from "react";
import {useNavigate, useLocation, Link, useSearchParams} from 'react-router-dom';
import {UserOutlined} from '@ant-design/icons'
import {HomeIcon, ShortsIcon, SubscriptionsIcon} from "./icons";
import MenuItem from "./MenuItem";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/reducer";
import {CollapseContext, menu} from "../LayoutBase";
import {MenuButton} from "../Navbar/icons";
import {Avatar} from "antd";
import {useTranslation} from "react-i18next";
import Icons from "../../config/icon";


export default function MenuBar() {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const {t} = useTranslation();
    const {user, isAuthenticated, subscribers} = useSelector(selectUser);
    const {collapse, setCollapse} = useContext(CollapseContext) as menu;
     let [searchParams] = useSearchParams();
    const type=searchParams.get("type")
    return (
        <div
            className={`p-2 lg:mt-16 bg-white dark:bg-black  h-screen overflow-auto fixed no-scrollbar z-[200] lg:left-0 ${!collapse ? 'left-[-240px]' : 'left-0'}`}
            style={{transition: 'all .2s ease-in-out'}}>
            <div className="flex items-center my-3 lg:hidden">
                <button className="nav-icon flex" onClick={() => setCollapse(!collapse)}>
                    <MenuButton/>
                </button>
                <div
                    className="flex items-center cursor-pointer" style={{height: '50px'}}
                    onClick={() => navigate('/')}
                >
                    <img src={'/logo.svg'} width={80}/>
                </div>
            </div>
            <div className="my-2">
                <div onClick={() => navigate('/')}>
                    <MenuItem
                        icon={<HomeIcon selected={pathname === '/'}/>}
                        title={'home'}
                        selected={pathname === '/'}
                    />
                </div>
                <MenuItem icon={<ShortsIcon selected={false}/>} title="shorts"/>
                {isAuthenticated &&
                    <div onClick={() => navigate('/subscriptions')}>
                        <MenuItem icon={<SubscriptionsIcon selected={false} />} title={t("subscriptions")} />
                    </div>
                }
                {collapse && <MenuItem icon={<SubscriptionsIcon selected={false} />} title={t('you') } />}

                {isAuthenticated && !collapse &&
                    <div
                        className={`flex flex-col py-2  gap-[8px] border-t mt-1 border-b`}>
                        <h6 className={'text-[16px] font-bold flex items-center gap-[10px] px-3'}>
                            {t('you')} <Icons name={'next'}/>
                        </h6>
                        <div onClick={() => navigate(`/channel/${user?.id}`)}
                             className={'gap-[16px] flex items-center cursor-pointer px-3 py-[6px] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 ' + (pathname === `/channel/${user?.id}` ? 'bg-neutral-100 dark:bg-neutral-700' : '')}>
                            <Icons name={'channel'}/> {t('your_channel')}
                        </div>
                        <div onClick={() => navigate(`/channel-content`)}
                             className={'gap-[16px] flex items-center cursor-pointer px-3 py-[6px] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 ' + (pathname === `/channel/content` ? 'bg-neutral-100 dark:bg-neutral-700' : '')}>
                            <Icons name={'history'}/>{t('channel_content')}
                        </div>
                        <div
                            className={'gap-[16px] flex items-center cursor-pointer px-3 py-[6px] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900'}>
                            <Icons name={'playlists'}/> {t('playlists')}
                        </div>
                        <div
                            className={'gap-[16px] flex items-center cursor-pointer px-3 py-[6px] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900'}>
                            <Icons name={'watch_later'}/> {t('watch_later')}
                        </div>
                        <div
                            className={'gap-[16px] flex items-center cursor-pointer px-3 py-[6px] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900'}>
                            <Icons name={'thumbup'}/> {t('liked_videos')}
                        </div>
                    </div>
                }
                {isAuthenticated && !collapse &&
                    <div
                        className={`flex flex-col py-2  gap-[8px] mt-1 border-b`}>
                        <h6 className={'text-[16px] font-bold px-3'}>{t('subscriptions')}</h6>
                        {subscribers && subscribers.slice(0, 6).map((user: any) => (
                            <Link to={`/channel/${user?.id}`} key={user.id}
                                  className={'gap-[16px] flex items-center cursor-pointer px-3 py-[6px] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 ' + (pathname === `/channel/${user?.id}` ? 'bg-neutral-100 dark:bg-neutral-700' : '')}>
                                <Avatar size={24} icon={<UserOutlined/>} src={user.avatar}/>
                                <div className={'text-sm'}>{user?.username}</div>
                            </Link>
                        ))}
                        <div
                            className={'gap-[20px] flex items-center cursor-pointer px-3 ' + (pathname === `/channels` ? 'bg-neutral-100 dark:bg-neutral-700' : '')}
                            onClick={() => navigate('/channels')}>
                            <Icons name={'all_menu'}/> {t('all_subscriptions')}
                        </div>
                    </div>
                }
                {!collapse &&
                    <div
                        className={`flex flex-col pt-2  gap-[8px] mt-1 border-b pb-[120px]`}>
                        <h6 className={'text-[16px] font-bold flex items-center gap-[10px] px-3'}>
                            {t('explore')}
                        </h6>
                        {/*<div*/}
                        {/*    className={'gap-[16px] flex items-center cursor-pointer px-3 py-[6px] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900'}>*/}
                        {/*    <Icons name={'trending'}/> Trending*/}
                        {/*</div>*/}
                        <div onClick={() => navigate('/subscriptions?type=music')}
                             className={'gap-[16px] flex items-center cursor-pointer px-3 py-[6px] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 ' + (pathname === '/subscriptions' && type==='music' ? 'bg-neutral-100 dark:bg-neutral-700' : '')}>
                            <Icons name={'music'}/> {t('music')}
                        </div>
                        <div onClick={() => navigate('/subscriptions?type=movie')}
                             className={'gap-[16px] flex items-center cursor-pointer px-3 py-[6px] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 ' + (pathname === '/subscriptions' && type==='movie' ? 'bg-neutral-100 dark:bg-neutral-700' : '')}>
                            <Icons name={'playlists'}/> {t('movie_tv')}
                        </div>
                        {/*<div*/}
                        {/*    className={'gap-[16px] flex items-center cursor-pointer px-3 py-[6px] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900'}>*/}
                        {/*    <Icons name={'channel'}/> Live*/}
                        {/*</div>*/}
                        <div onClick={() => navigate('/subscriptions?type=gaming')}
                             className={'gap-[16px] flex items-center cursor-pointer px-3 py-[6px] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 ' + (pathname === '/subscriptions' && type==='gaming' ? 'bg-neutral-100 dark:bg-neutral-700' : '')}>
                            <Icons name={'gaming'}/> {t('gaming')}
                        </div>
                        <div onClick={() => navigate('/subscriptions?type=news')}
                             className={'gap-[16px] flex items-center cursor-pointer px-3 py-[6px] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 ' + (pathname === '/subscriptions' && type==='news' ? 'bg-neutral-100 dark:bg-neutral-700' : '')}>
                            <Icons name={'channel'}/> {t('news')}
                        </div>
                        <div onClick={() => navigate('/subscriptions?type=sports')}
                             className={'gap-[16px] flex items-center cursor-pointer px-3 py-[6px] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 ' + (pathname === '/subscriptions' && type==='sports'? 'bg-neutral-100 dark:bg-neutral-700' : '')}>
                            <Icons name={'sports'}/> {t('sports')}
                        </div>
                        <div onClick={() => navigate('/subscriptions?type=courses')}
                             className={'gap-[16px] flex items-center cursor-pointer px-3 py-[6px] rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 ' + (pathname === '/subscriptions' && type==='courses' ? 'bg-neutral-100 dark:bg-neutral-700' : '')}>
                            <Icons name={'channel'}/> {t('courses')}
                        </div>
                    </div>
                }
            </div>

        </div>
    )
};