import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../hooks/publish-manage/usePublish'
import { Button } from 'antd';

// 已下线
export default function Sunset() {

    const { dataSource, handleDelete } = usePublish(3)

    return (
        <div>
            <NewsPublish
                dataSource={dataSource}
                whatButtonFn={(id) =>
                    <Button
                        danger
                        onClick={() => { handleDelete(id) }}
                    >
                        删除
                    </Button>}
            >
            </NewsPublish>
        </div>
    )
}
