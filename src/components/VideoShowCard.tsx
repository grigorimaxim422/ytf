import React from 'react';
import {Link} from 'react-router-dom';



interface Props {
    thumbnail: string;
    title: string;
    description: string;
    id: number
}

const VideoShowCard: React.FC<Props> = ({
                                            thumbnail, title, description, id
                                        }) => {

    return (
        <>
            {title ?
                <div className={''}>
                    <div className="w-full flex items-center gap-[16px]">
                        <Link to={`/watch?v=${id}`} className={'w-[150px] rounded-[12px] overflow-hidden'}>
                            <div style={{
                                backgroundImage: `url(${thumbnail})`,
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                            }}
                                 className={'h-[70px]'}
                            >
                            </div>
                        </Link>
                        <div>
                            <p className="text-black dark:text-white text-lg">
                                {title}
                            </p>
                            <p className="text-black dark:text-white text-[12px] line-clamp-1">
                                {description}
                            </p>
                        </div>

                    </div>
                </div>
                : <div></div>}
        </>
    );
};

export default VideoShowCard;
