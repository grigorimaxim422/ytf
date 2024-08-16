import React, {useContext} from "react";

import {
    CreateVideoIcon,
    MenuButton,
    NotificationIcon,
    ProfileIcon,
    DotIcon
} from "./icons";
import SearchBar from "./SearchBar";
import {CollapseContext, menu} from "../LayoutBase";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import { selectUser} from "../../redux/reducer";
import {Popover, Tooltip} from "antd";
import {useTranslation} from "react-i18next";
import RightSidebar from "../RIghtSideBar";

const Navbar = () => {
    const {collapse, setCollapse} = useContext(CollapseContext) as menu;
    const navigate = useNavigate();
    const {isAuthenticated} = useSelector(selectUser);
    const {t} = useTranslation();

    return (
        <nav className="flex flex-row justify-between items-center fixed w-full z-[1000] bg-white dark:bg-black">
            <div className="flex items-center my-3">
                <button className="nav-icon flex" onClick={() => setCollapse(!collapse)}>
                    <MenuButton/>
                </button>
                <div
                    className="flex items-center cursor-pointer" style={{height: '50px'}}
                    onClick={() => navigate('/')}
                >
                    <img src={'/logo.svg'} width={80} alt={''}/>
                </div>
            </div>
            <div className="lg:w-[650px] md:w-[400] w-[150px] flex justify-end items-center">
                <SearchBar/>
                {/*<div className="nav-icon bg-neutral-100 ">*/}
                {/*    <MicrophoneIcon/>*/}
                {/*</div>*/}
            </div>
            <div className="flex mr-3">
                {isAuthenticated &&
                    <Tooltip placement="bottom" title={t('upload_video')}>
                        <button className="nav-icon hidden sm:flex" onClick={() => navigate('/video/create')}>
                            <CreateVideoIcon/>
                        </button>
                    </Tooltip>
                }
                {isAuthenticated &&
                    <Tooltip placement="bottom" title={t('Notifications')}>
                        <button className="hidden sm:flex nav-icon">
                            <NotificationIcon/>
                        </button>
                    </Tooltip>
                }
                {isAuthenticated ?
                    <Popover content={RightSidebar} trigger="click" placement={'leftTop'}
                             rootClassName={'rightSideBar'}>
                        <button className="nav-icon flex "
                                style={{
                                    fontSize: '16px',
                                    width: 40,
                                    height: 40,
                                }}
                        >
                            <ProfileIcon/>
                        </button>
                    </Popover>

                    :
                    <>
                        <Popover content={RightSidebar} trigger="click" placement={'leftTop'} rootClassName={'rightSideBar'}>
                            <button className="nav-icon rounded-[5px]"
                                    style={{
                                        fontSize: '16px',
                                        width: 40,
                                        height: 40,
                                        padding:'8px'
                                    }}
                            >
                                <DotIcon/>
                            </button>
                        </Popover>
                        <button onClick={() => navigate('/login')}
                                className={'w-full border rounded-[12px] py-2 bg-primary text-white flex px-3 items-center gap-2'}>
                             <ProfileIcon classname={'w-5 h-5'}/> {t('login')}
                        </button>
                    </>
                }
            </div>
        </nav>
    );
};

export default Navbar;
