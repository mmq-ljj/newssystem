import React, { useEffect, useRef, useState } from 'react'
import {
  PageHeader,
  Steps,
  Button,
  Form,
  Input,
  Select,
  message,
  notification
} from 'antd'
import style from './News.module.css'
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor'

const { Step } = Steps;
const { Option } = Select;

// console.log(style);

// 撰写新闻
export default function NewsAdd(props) {

  const [currentStep, setCurrentStep] = useState(0)
  // 新闻分类数据
  const [newsCategoryList, setNewsCategoryList] = useState([])
  // 第一步基本信息表单ref
  const NewsForm = useRef(null)
  // 第一步 基本信息
  const [formInfo, setFormInfo] = useState({})
  // 第二步 新闻内容
  const [content, setContent] = useState("")
  // 从本地取出用户信息
  const user = JSON.parse(localStorage.getItem('token'))
  // console.log(user);

  useEffect(() => {
    getNewsCategory()
  }, [])


  const getNewsCategory = async () => {
    const { data: res } = await axios.get('/categories')
    // console.log(res);
    // 基本信息 - 新闻分类
    setNewsCategoryList(res)
  }

  // 下一步
  const handleNext = () => {
    if (currentStep === 0) {
      // console.log(NewsForm);
      NewsForm.current.validateFields()
        .then(res => {
          console.log(res);
          // 基本信息
          setFormInfo(res)
          setCurrentStep(currentStep + 1)
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      console.log(formInfo, content);
      if (content === '' || content.trim() === '<p></p>') {
        message.warn('请输入新闻内容！')
      } else {
        setCurrentStep(currentStep + 1)
      }

    }
  }

  // 上一步
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSave = (auditState) => {
    axios.post('/news', {
      // title: formInfo.title,  // 标题
      // categoryId: formInfo.id, // 分类
      ...formInfo,
      content: content,   // 内容
      region: user.region ? user.region : '全球', // 区域
      author: user.username, // 用户名
      roleId: user.roleId,
      auditState: auditState,   // 0 草稿箱 1 待审核 2 审核通过 3 审核驳回
      publishState: 0, // 0 未发布
      createTime: Date.now(), // 创建时间
      star: 0,  // 点赞数量
      view: 0,  // 浏览数量
      // publishTime: 0 // 发布时间
    }).then(res => {
      // console.log(res);
      // 保存到草稿箱
      if (auditState === 0) {
        if (res.status === 201) {
          props.history.push('/news-manage/draft')
          message.success('保存成功！')
        }
      } else {
        if (res.status === 201) {
          message.success('提交审核成功！')
          props.history.push('/audit-manage/list')
        }
      }
      notification.info({
        message: `通知`,
        description:
          `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻!`,
        placement: "bottomRight",
      });

    })
  }

  return (
    <div>
      {/* 一、页头 */}
      <PageHeader
        className="site-page-header"
        // onBack={() => null}
        title="撰写新闻"
        subTitle=""
      />

      {/* 二、步骤条 */}
      <Steps current={currentStep}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" subTitle="" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

      {/*  三、每一步对应的内容 */}
      <div className={style.news_content}>
        {/* 第一步 */}
        <div
          className={currentStep === 0 ? "" : style.active}
        >
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 10 }}
            ref={NewsForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: '请输入新闻标题' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: '请选择新闻类别' }]}
            >
              <Select
              // onChange={handleChange}
              >
                {
                  newsCategoryList.map(item =>
                    <Option value={item.id} key={item.id}>{item.title}</Option>)
                }
              </Select>
            </Form.Item>
          </Form>
        </div>

        {/* 第二步 */}
        <div
          className={currentStep === 1 ? "" : style.active}
        >
          <NewsEditor getContent={(val) => { setContent(val) }}>
          </NewsEditor>
        </div>

        {/* 第三步 */}
        <div
          className={currentStep === 2 ? "" : style.active}
        >
        </div>
      </div>

      {/* 四、操作按钮 */}
      <div style={{ marginTop: "50px" }}>

        {
          currentStep < 2 &&
          <Button
            type='primary'
            onClick={handleNext}
            className={style.next}
          >
            下一步
          </Button>
        }

        {
          currentStep > 0 &&
          <Button
            onClick={handlePrevious}
            className={style.next}
          >
            上一步
          </Button>
        }

        {
          currentStep === 2 && <span>
            <Button
              type='primary'
              className={style.next}
              onClick={() => { handleSave(0) }}
            >
              保存草稿箱
            </Button>

            <Button
              type='primary'
              style={{ backgroundColor: '#85ce61', border: "1px solid #85ce61" }}
              onClick={() => { handleSave(1) }}
            >
              提交审核
            </Button>
          </span>
        }
      </div>
    </div>
  )
}
