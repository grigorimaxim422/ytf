import React from 'react';
import {subscribeChannel} from '../api/apiCalls/video';
import {useUser} from "../hooks";
import {useSelector} from "react-redux";
import {selectUser} from "../redux/reducer";
import {useTranslation} from "react-i18next";


interface Props {
    author: any;
    getSVideoStat: () => void
}

const SubscribeButton: React.FC<Props> = ({author, getSVideoStat}) => {
     const { isAuthenticated } = useSelector(selectUser);
    const {getCurrentUser} = useUser();
    const {t} = useTranslation();
    const subscribe = async () => {
        try {
            const payload = {
                id: author.id
            }
            const res = await subscribeChannel(payload);
            if (res) {
                getSVideoStat();
                getCurrentUser()
            }
        } catch (e) {
            console.log(e);
        }
    };


    return (
        <>
            {author && isAuthenticated && <div>
                {author.is_subscribed ?
                    <button className={'border py-2 px-3 rounded-[12px] bg-white dark:bg-black font-bold'}
                            onClick={() => subscribe()}
                    >{t('unsubscribe')}</button>
                    :
                    <button className={'border py-2 px-3 rounded-[12px] bg-primary text-white font-bold'}
                            onClick={() => subscribe()}>
                        {t('subscribe')}
                    </button>}
            </div>}
        </>
    );
};

export default SubscribeButton;
