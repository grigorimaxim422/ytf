import React from 'react';
import {Link} from 'react-router-dom';
import TimeAgo from 'javascript-time-ago';
import ko from 'javascript-time-ago/locale/ko';
import {Avatar} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

TimeAgo.addDefaultLocale(ko);
const timeAgo = new TimeAgo('ko-KR');

interface Props {
  data: any;
}

const VideoHomeCard: React.FC<Props> = ({
                                          data,
                                        }) => {
const {t} = useTranslation();
  return (
    <>
      {data &&
        <div className={''}>
          <div className="w-full flex flex-col">
            <div className="relative rounded-[12px] overflow-hidden hover:rounded-[0]  ease-in-out duration-[500ms]">

              <Link to={`/watch?v=${data.id}`}>
                <div style={{
                  backgroundImage: `url(${data.thumbnail})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
                     className={'h-[230px]'}
                >
                </div>
              </Link>

            </div>

            <div className="flex flex-row mt-2 gap-2 py-4">
                 <Avatar size={54} icon={<UserOutlined/>} src={data.author.avatar}/>

              <div className="flex flex-col">
                <Link to={`/watch?v=${data.id}`}>
                  <p className="text-black dark:text-white text-lg font-semibold line-clamp-2">
                    {data.title}
                  </p>
                </Link>
                <Link to={`/channel/${data.author?.id}`} className="text-gray-800 dark:text-gray-50  mt-1 hover:text-gray-400 ">
                  {data.author?.username}
                </Link>
                <p className="text-gray-900 dark:text-gray-400 mt-1">{data.views_count} {t('views')}
                  . {timeAgo.format(new Date(data.created_at))}</p>
              </div>

            </div>
          </div>
        </div>
      }
    </>
  );
};

export default VideoHomeCard;
