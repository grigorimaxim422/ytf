import React from 'react';
import {Skeleton} from 'antd';

const VideoSkeleton = ({single}: { single?: boolean }) => {

    return (
        <>
            {single ? <div className={'grid grid-cols-1 gap-[16px]'}>
                    {[1, 2, 3, 4, 5, 6,].map((i: number) => (
                        <div key={i}>
                            <Skeleton.Node active={true}>

                            </Skeleton.Node>
                            <div className={'mb-3'}/>
                            <Skeleton avatar paragraph={{rows: 3}} active={true}/>
                        </div>
                    ))}

                </div> :
                <div className={'grid lg:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-[16px]'}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i: number) => (
                        <div key={i}>
                            <Skeleton.Node active={true}>

                            </Skeleton.Node>
                            <div className={'mb-3'}/>
                            <Skeleton avatar paragraph={{rows: 3}} active={true}/>
                        </div>
                    ))}

                </div>
            }
        </>
    );
};

export default VideoSkeleton;
