import React, {Suspense, useEffect} from 'react';
import {ConfigProvider, theme} from 'antd';
import './assets/scss/globals.scss';
import './assets/scss/layout.scss';
import Loading from "./components/loading";
import {useDispatch, useSelector} from 'react-redux';
import {useUser} from "./hooks";
import {selectUser, setCategory} from "./redux/reducer";
import {getCategory} from "./api/apiCalls/video";
import {Layout} from 'antd';
import LayoutBase from "./components/LayoutBase";
import {Routes, Route} from "react-router-dom"
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Watch from "./pages/watch";
import Channel from "./pages/channel";
import Channels from "./pages/channels";
import Subscriptions from "./pages/subscriptions";
import ChannelContent from "./pages/channelContent";
import VideoUpload from "./pages/videoUpload";
import Settings from "./pages/settings";

const getDarkMode = () => localStorage.getItem("dark_mode")

function App() {
    const dispatch = useDispatch();
    const {getCurrentUser} = useUser();
    const {token} = useSelector(selectUser);

    useEffect(() => {
        document.querySelector('html')?.classList.remove('light', 'dark')
        getDarkMode() === 'true' &&
        document.querySelector('html')?.classList.add('dark')
    }, [getDarkMode()])
    const gCategory = async () => {
        try {
            const res = await getCategory()
            if (res) {
                dispatch(setCategory(res.categories))
            }
        } catch (e) {

        }
    }
    useEffect(() => {
        console.log(token)
        gCategory()
        if (token) {
            getCurrentUser();
        }
    }, [token]);
    useEffect(() => {
        window.addEventListener('error', e => {
            if (e.message === 'ResizeObserver loop limit exceeded') {
                const resizeObserverErrDiv = document.getElementById(
                    'webpack-dev-server-client-overlay-div'
                );
                const resizeObserverErr = document.getElementById(
                    'webpack-dev-server-client-overlay'
                );
                if (resizeObserverErr) {
                    resizeObserverErr.setAttribute('style', 'display: none');
                }
                if (resizeObserverErrDiv) {
                    resizeObserverErrDiv.setAttribute('style', 'display: none');
                }
            }
        });
    }, []);
    return (
        <div className="App">

            <ConfigProvider
                theme={{
                    // 1. Use dark algorithm
                    algorithm: getDarkMode() === 'true'?theme.darkAlgorithm:theme.defaultAlgorithm
                }}
            >
                <Suspense fallback={<Loading/>}>
                    <main className="">
                        <Layout>
                            <LayoutBase>
                                <div className={'p-4 md:p-6 w-full'}>
                                    <Routes>
                                        <Route path="/" element={<Home/>}/>
                                        <Route path="/login" element={<Login/>}/>
                                        <Route path="/signup" element={<Signup/>}/>
                                        <Route path="/watch" element={<Watch/>}/>
                                        <Route path="/video/create" element={<VideoUpload/>}/>
                                        <Route path="/channels" element={<Channels/>}/>
                                        <Route path="/settings" element={<Settings/>}/>
                                        <Route path="/subscriptions" element={<Subscriptions/>}/>
                                        <Route path="/channel-content" element={<ChannelContent/>}/>
                                        <Route path="/channel/:id" element={<Channel/>}/>
                                    </Routes>
                                </div>
                            </LayoutBase>
                        </Layout>
                    </main>
                </Suspense>
            </ConfigProvider>
        </div>
    );
}

export default App;
