import React from 'react'
import { Button } from 'antd';
import axios from 'axios'

export default function Home() {

  // 查 get
  // const getData = async () => {
  //   const { data: res } = await axios.get('http://localhost:8000/news/1')
  //   console.log(res);
  // }

  // 增 post
  // const add = async () => {
  //   const { data: res } = await axios.post('http://localhost:8000/news', {
  //     "title": "444",
  //     "author": "xfx"
  //   })
  //   console.log(res);
  // }

  // 改 put
  // put 有一个弊端 是直接改整个对象
  // const getData = async () => {
  //   const { data: res } = await axios.put('http://localhost:8000/news/1', {
  //     "title": "666",
  //  // "author": "555"
  //   })
  //   console.log(res);
  // }

  // 改 patch  (可以改对象里某个属性)
  // const getData = async () => {
  //   const { data: res } = await axios.patch('http://localhost:8000/news/1', {
  //     "title": "666",
  //   })
  //   console.log(res);
  // }

  // 删 delete
  // const getData = async () => {
  //   const { data: res } = await axios.delete('http://localhost:8000/news/2')
  //   console.log(res);
  // }


  // 关联 _embed   (找向下关联的) 通过新闻找到向下关联的评论
  // const getData = async () => {
  //   const { data: res } = await axios.get('http://localhost:8000/news?_embed=comments')
  //   console.log(res);
  // }

  // 关联 _expand (向上关联)
  const getData = async () => {
    const { data: res } = await axios.get('http://localhost:8000/comments?_expand=news')
    console.log(res);
  }

  return (
    <div>
      Home
      <Button onClick={getData} >按钮</Button>
    </div >
  )
}
