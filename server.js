const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// ==================== API 路由 ====================

// 假数据
let users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', age: 25 },
  { id: 2, name: '李四', email: 'lisi@example.com', age: 30 },
  { id: 3, name: '王五', email: 'wangwu@example.com', age: 28 }
];

let posts = [
  { id: 1, title: '第一篇文章', content: '这是第一篇文章的内容', authorId: 1, createdAt: '2024-01-01' },
  { id: 2, title: '第二篇文章', content: '这是第二篇文章的内容', authorId: 2, createdAt: '2024-01-02' }
];

// GET /api/users - 获取所有用户
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: users,
    message: '获取用户列表成功'
  });
});

// GET /api/users/:id - 根据ID获取用户
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (user) {
    res.json({
      success: true,
      data: user,
      message: '获取用户成功'
    });
  } else {
    res.status(404).json({
      success: false,
      message: '用户不存在'
    });
  }
});

// POST /api/users - 创建用户
app.post('/api/users', (req, res) => {
  const { name, email, age } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: '姓名和邮箱为必填项'
    });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    age: age || 18
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser,
    message: '用户创建成功'
  });
});

// PUT /api/users/:id - 更新用户
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: '用户不存在'
    });
  }
  
  const { name, email, age } = req.body;
  users[index] = { ...users[index], name, email, age };
  
  res.json({
    success: true,
    data: users[index],
    message: '用户更新成功'
  });
});

// DELETE /api/users/:id - 删除用户
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: '用户不存在'
    });
  }
  
  users.splice(index, 1);
  
  res.json({
    success: true,
    message: '用户删除成功'
  });
});

// GET /api/posts - 获取所有文章
app.get('/api/posts', (req, res) => {
  res.json({
    success: true,
    data: posts,
    message: '获取文章列表成功'
  });
});

// GET /api/posts/:id - 根据ID获取文章
app.get('/api/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find(p => p.id === id);
  
  if (post) {
    res.json({
      success: true,
      data: post,
      message: '获取文章成功'
    });
  } else {
    res.status(404).json({
      success: false,
      message: '文章不存在'
    });
  }
});

// POST /api/posts - 创建文章
app.post('/api/posts', (req, res) => {
  const { title, content, authorId } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: '标题和内容为必填项'
    });
  }
  
  const newPost = {
    id: posts.length + 1,
    title,
    content,
    authorId: authorId || 1,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  posts.push(newPost);
  
  res.status(201).json({
    success: true,
    data: newPost,
    message: '文章创建成功'
  });
});

// POST /api/test/echo - 回显测试接口
app.post('/api/test/echo', (req, res) => {
  res.json({
    success: true,
    data: {
      received: req.body,
      timestamp: new Date().toISOString()
    },
    message: '数据接收成功'
  });
});

// GET /api/test/delay - 延迟响应测试接口
app.get('/api/test/delay', (req, res) => {
  const delay = parseInt(req.query.ms) || 1000;
  
  setTimeout(() => {
    res.json({
      success: true,
      message: `延迟 ${delay}ms 后响应成功`,
      delay: delay
    });
  }, delay);
});

// POST /api/test/validate - 数据验证测试接口
app.post('/api/test/validate', (req, res) => {
  const { username, password } = req.body;
  const errors = [];
  
  if (!username || username.length < 3) {
    errors.push('用户名至少需要3个字符');
  }
  
  if (!password || password.length < 6) {
    errors.push('密码至少需要6个字符');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
      message: '数据验证失败'
    });
  }
  
  res.json({
    success: true,
    message: '数据验证通过'
  });
});

// ==================== 首页 ====================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==================== 启动服务器 ====================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║  🚀 服务器启动成功！                          ║
╚════════════════════════════════════════════════╝
  
📍 本地访问: http://localhost:${PORT}
📄 API 测试页面: http://localhost:${PORT}/index.html

📡 可用的 API 端点:
  • GET    /api/users        - 获取用户列表
  • GET    /api/users/:id    - 获取单个用户
  • POST   /api/users        - 创建用户
  • PUT    /api/users/:id    - 更新用户
  • DELETE /api/users/:id    - 删除用户
  
  • GET    /api/posts        - 获取文章列表
  • GET    /api/posts/:id    - 获取单个文章
  • POST   /api/posts        - 创建文章
  
  • POST   /api/test/echo    - 回显测试
  • GET    /api/test/delay   - 延迟响应测试
  • POST   /api/test/validate - 数据验证测试

按 Ctrl+C 停止服务器
  `);
});

module.exports = app;
