import {useDispatch, useSelector} from "react-redux";
import {logout, selectUser} from "../redux/reducer";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {Popover, Avatar} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {langs} from "../utils";
import Icons from "../config/icon";

const getDarkMode = () => localStorage.getItem("dark_mode")
export default function RightSidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user, token, isAuthenticated, subscribers} = useSelector(selectUser);
    const {t, i18n} = useTranslation();

    const handleChange = (value: string) => {
        i18n.changeLanguage(value)
    };
    const handleLogout = async () => {
        dispatch(logout());
        navigate('/login');
    };
    // You can add any UI inside Loading, including a Skeleton.
    return (<div className={'gap-[16px] max-w-[320px] w-full overflow-hidden'}>
        {isAuthenticated && <>
            <div className={'p-3 w-[400px]'}>
                <div className={'flex gap-[16px] items-start'}>
                    <div>
                        <Avatar size={44} icon={<UserOutlined/>} src={user?.avatar}/>
                    </div>
                    {user?.channel_name ?
                        <div className={''}>
                            <div
                                className={'text-[20px]'}>{user?.channel_name}</div>
                            <div className={'flex flex-wrap items-center gap-[10px]'}>
                                <strong>@{user?.channel_handle_name} </strong>
                            </div>
                            <div onClick={() => navigate(`/channel/${user?.id}`)}
                                 className={'text-primary my-1 py-0 px-0 cursor-pointer'}>
                                {t('view_your_channel')}
                            </div>
                        </div> :
                        <div onClick={() => navigate(`/channel/${user?.id}`)}
                             className={'text-primary my-1 py-0 px-0 cursor-pointer'}>
                            {t('create_a_channel')}
                        </div>
                    }
                </div>
            </div>
        </>
        }
        <div className={'max-h-[75vh] overflow-y-auto'}>

            {isAuthenticated &&
                <div className={'border-t border-b py-1'}>
                    <button className={'flex items-center py-2 gap-[10px] px-3'}>
                        <Icons name={'google'}/> {t('google_account')}
                    </button>
                    <button className={'flex items-center py-2 gap-[10px] px-3'}>
                        <Icons name={'switchAccount'}/>{t('switch_account')}
                    </button>
                    <button onClick={() => handleLogout()} className={'flex items-center py-2 gap-[10px] px-3'}>
                        <Icons name={'logout'}/> {t('sign_out')}
                    </button>
                </div>
            }
            <div className={'border-b py-1'}>
                <button className={'flex items-center py-2 gap-[10px] px-3'}>
                    <Icons name={'studio'}/> {t('youtube_studio')}
                </button>
                <button className={'flex items-center py-2 gap-[10px] px-3'}>
                    <Icons name={'purchase'}/> {t('purchase_memberships')}
                </button>
            </div>

            <div className={'border-b py-1'}>
                <button className={'flex items-center py-2 gap-[10px] px-3'}>
                    <Icons name={'data'}/> {t('your_data_in')}
                </button>
                <Popover placement={'leftTop'} rootClassName={'rightSideBar'} content={
                    <div className={' max-w-[100px] w-[100px]'}>
                        <button className={'py-2 px-3 hover:bg-neutral-100'}
                                onClick={() => {
                                    localStorage.setItem('dark_mode', 'false');
                                    window.location.reload();
                                }}>
                            {t('light')}
                        </button>
                        <button className={'py-2 px-3 hover:bg-neutral-100'}
                                onClick={() => {
                                    localStorage.setItem('dark_mode', 'true');
                                    window.location.reload();
                                }}
                        >
                            {t('dark')}
                        </button>
                    </div>
                }

                         trigger="click">
                    <button className={'flex items-center py-2 gap-[10px] justify-between px-3'}>
                        <div className={'flex items-center gap-[10px]'}><Icons name={'appearance'}/>
                            {t('appearance')}: {getDarkMode() === 'true' ? t('dark') : t('light')}
                        </div>
                        <Icons name={'next'}/>
                    </button>
                </Popover>
                <Popover placement={'leftTop'} rootClassName={'rightSideBar'} content={
                    <div className={' max-w-[100px] w-[100px]'}>
                        {langs.map((lang: any) => (
                            <button className={'py-2 px-3'}
                                    key={lang.value}
                                    onClick={() => {
                                        handleChange(lang.value)
                                    }}
                            >{lang.label}</button>
                        ))
                        }
                    </div>
                }

                         trigger="click">
                    <button className={'flex items-center py-2 gap-[10px] justify-between px-3'}>
                        <div className={'flex items-center gap-[10px]'}><Icons name={'language'}/>
                            {t('language')}: {langs.find((lang: any) => lang.value === i18n.language)?.label}
                        </div>
                        <Icons name={'next'}/>
                    </button>
                </Popover>
                <button className={'flex items-center py-2 gap-[10px] px-3'}>
                    <Icons name={'restriction'}/> {t('restriction_mode')}
                </button>
                <button className={'flex items-center py-2 gap-[10px] px-3'}>
                    <Icons name={'location'}/>{t('location')} : {t('Korea')}
                </button>
                <button className={'flex items-center py-2 gap-[10px] px-3'}>
                    <Icons name={'keyboard'}/>{t('keyboard_shortcuts')}
                </button>
            </div>
            <div className={'border-b py-1'}>
                <button className={'flex items-center py-2 gap-[10px] px-3'}
                        onClick={() => navigate(`/settings`)}>
                    <Icons name={'settings'}/>{t('settings')}
                </button>
            </div>
            <div className={'py-1'}>
                <button className={'flex items-center py-2 gap-[10px] px-3'}>
                    <Icons name={'help'}/>{t('help')}
                </button>
                <button className={'flex items-center py-2 gap-[10px] px-3'}>
                    <Icons name={'feedback'}/>{t('send_feedback')}
                </button>
            </div>

        </div>
    </div>)
}