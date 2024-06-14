export default {
  items: [{
    name: 'userName',
    label: '账号',
    eltype: 'input',
    placeholder: ''
  }, {
    name: 'password',
    label: '密码',
    eltype: 'input',
    placeholder: '',
    type: 'password'
  }, {
    name: '',
    eltype: 'treaty',
    placeholder: ''
  }, {
    name: 'code',
    label: '验证码',
    eltype: 'authCode',
    placeholder: ''
  }, {
    eltype: 'button',
    list: [{
      text: '登录',
      className: ''
    }]
  },

  ]

};
