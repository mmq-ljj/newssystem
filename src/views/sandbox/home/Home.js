import React, { useEffect, useState, useRef } from 'react'
import {
  Card,
  Col,
  Row,
  List,
  Avatar,
  Drawer
} from 'antd';
import axios from 'axios'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import * as echarts from 'echarts'
import _ from 'lodash'

const { Meta } = Card;

// 首页
export default function Home() {

  const [views, setViews] = useState([])
  const [star, setStar] = useState([])
  const [allList, setAllList] = useState([])
  const [pieChart, setPieChart] = useState(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  // 柱状图ref
  const barRef = useRef(null)
  // 饼状图ref
  const pieRef = useRef(null)
  useEffect(() => {
    // 浏览量最多
    getMostFrequentBrowsing()
    // 点赞最多
    getMostStar()
  }, [])

  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then(res => {
      // console.log(res);
      // console.log(_.groupBy(res.data, item => item.category.title));
      let dealData = _.groupBy(res.data, item => item.category.title)
      renderBarView(dealData)
      setAllList(res.data)
    })
    return () => {
      window.onresize = null
    }
  }, [])

  // 渲染图表
  const renderBarView = (dealData) => {
    // console.log(dealData);
    // console.log(Object.keys(dealData));
    // console.log(Object.values(dealData));
    // console.log(Object.values(dealData).map(item => item.length));
    // 柱状图x轴 名字
    let xTitleList = Object.keys(dealData)
    // 柱状图y轴 数量
    let yDataList = Object.values(dealData).map(item => item.length)

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: xTitleList,
        axisLabel: {
          interval: 0,
          // rotate: "60",
        }
      },
      yAxis: {
        minInterval: 1 // y轴最小间隔
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: yDataList,
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.onresize = () => {
      // console.log('resize');
      myChart.resize()
    }
  }

  // 获取用户最多浏览
  const getMostFrequentBrowsing = () => {
    axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=7`).then(res => {
      if (res.status === 200) {
        // console.log('浏览');
        setViews(res.data)
      }
    })
  }

  // 获取用户最多浏览
  const getMostStar = () => {
    axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=7`).then(res => {
      if (res.status === 200) {
        // console.log('点赞');
        setStar(res.data)
      }
    })
  }

  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))

  // 渲染饼状图
  const renderPieView = () => {

    // 处理数据
    const currentList = allList.filter(item => item.author === username)
    // console.log(currentList);
    const groupObj = _.groupBy(currentList, item => item.category.title)
    console.log(groupObj);

    const pieData = []
    for (let k in groupObj) {
      // console.log(k);
      pieData.push({
        name: k,
        value: groupObj[k].length
      })

    }



    var myChart;
    if (!pieChart) {
      // myChart = echarts.init(pieRef.value);
      myChart = echarts.init(document.getElementById('pieRef'));
      setPieChart(myChart)
    } else {
      myChart = pieChart
    }
    var option;
    option = {
      title: {
        text: '当前用户发布新闻分类图示',
        // subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: pieData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }

  return (
    <div>
      <Row gutter={16}>

        {/* 一 */}
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              dataSource={views}
              renderItem={row => <List.Item>
                <a href={`#/news-manage/preview/${row.id}`}>{row.title}
                </a>
              </List.Item>}
            />
          </Card>
        </Col>

        {/* 二 */}
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              dataSource={star}
              renderItem={row => <List.Item>
                <a href={`#/news-manage/preview/${row.id}`}>{row.title}
                </a>
              </List.Item>}
            />
          </Card>
        </Col>

        {/* 三 */}
        <Col span={8}>
          <Card
            cover={
              // <img
              //   alt="example"
              //   src="/img/mmq.png"
              // />
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={() => {
                setDrawerVisible(true)
                setTimeout(() => {
                  renderPieView()
                }, 0)
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
            title="Card title"
            bordered={true}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b style={{ marginRight: '10px' }}>{region ? region : "全球"}</b>
                  <b>{roleName}</b>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* 侧边弹出层 */}
      <Drawer
        width="500px"
        title="个人新闻分类"
        placement="right"
        onClose={() => { setDrawerVisible(false) }}
        visible={drawerVisible}
      >
        <div id='pieRef' ref={pieRef} style={{
          height: "400px",
          marginTop: "30px"
        }}>
        </div>
      </Drawer>

      <div ref={barRef} style={{
        height: "400px",
        marginTop: "30px"
      }}>
      </div>
    </div >
  )
}
