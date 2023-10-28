const config = {
  dbName: 'social',
  ver: 1,
  debug: true,
  objectStores: [
    {
      objectStoreName: 'msg',
      index: [ // 索引 ， unique 是否可以重复
        // { name: 'uid', unique: false }
      ]
    },
    {
      objectStoreName: 'msg-group',
      index: [ // 索引 ， unique 是否可以重复
        // { name: 'uid', unique: false }
      ]
    }
  ],
  objects: { // 初始化数据
    // msg: [
    //   {
    //     sender_id: 1,
    //     receiver_id: 2,
    //     name: 'xxx',
    //     avatar: 'xxx',
    //     concent: 'xxx',
    //     content_type: 1,
    //     timeline: 20231010
    //   },
    // ]
  }
}

export default config
