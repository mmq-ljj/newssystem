import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../hooks/publish-manage/usePublish'
import { Button } from 'antd';

// 已发布
export default function Published() {

    const { dataSource, handleSunset } = usePublish(2)

    return (
        <div>
            <NewsPublish
                dataSource={dataSource}
                whatButtonFn={(id) =>
                    <Button
                        danger
                        onClick={() => { handleSunset(id) }}
                    >
                        下线
                    </Button>}
            >
            </NewsPublish>
        </div>
    )
}