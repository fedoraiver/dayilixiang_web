const fs = require('fs'); // 引入文件系统模块
const express = require('express');
const cors = require('cors'); // 引入 cors 中间件
const multer = require('multer');
const csv = require('csv-parser');
const { execSync } = require('child_process');
const path = require('path');

const app = express();
const port = 49154;
app.use(cors()); // 使用 cors 中间件，允许跨域请求

// 配置文件上传的存储位置和文件名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 存储文件的目录，确保该目录存在
  },
  filename: (req, file, cb) => {
    cb(null, '1.jpg' ); // 为上传的文件生成唯一的文件名
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' ) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片'));
  }
};


const upload = multer({ storage: storage, fileFilter: fileFilter });

// 设置静态文件目录，以便可以访问上传的文件
app.use(express.static('public'));

// 处理文件上传的 POST 请求
app.post('/upload', upload.single('imageFile'), (req, res) => {
  if (req.file) {
    // 文件上传成功
    res.redirect('http://10.250.136.172:49153/');
  } else {
    // 没有选择文件或上传失败
    res.status(400).json({ message: '文件上传失败' });
  }
});
// 添加一个路由来提供下载txt文件
app.get('/download', (req, res) => {
  const filePath = './uploads/1.csv'; // 指定txt文件的本地路径
  const fileName = '结果.csv'; // 设置用户下载的文件名

  // 使用Express的res.download方法来发送文件给用户
  res.download(filePath, fileName, (err) => {
    if (err) {
      // 如果出现错误，您可以处理它
      console.error(err);
      res.status(500).send('下载文件时出错');
    }
  });
});

app.listen(port, () => {
  console.log(`服务器运行在 http://10.250.136.172:${port}`);
});



// 读取CSV文件
function readCSVFile(filePath,callback) {
  const data = [];

  fs.createReadStream(filePath)
    .pipe(csv({ headers: false }))
    .on('data', (row) => {
      // 处理每一行数据
      data.push(row);
    })
    .on('end', () => {
      console.log('CSV文件读取完成');

      // 在这里可以对数据进行修改

      // 调用回调函数，将数据传递给回调函数
      if (callback) {
        callback(null, data);
      }
    })
    .on('error', (error) => {
      console.error('读取CSV文件时发生错误:', error.message);
      // 调用回调函数，传递错误信息
      if (callback) {
        callback(error, null);
      }
    });
}

// 定义API端点
app.get('/api/data-matrix/get', (req, res) => {
  // 调用readCSVFile函数获取数据
  const csvFilePath = './uploads/1.csv';
  readCSVFile(csvFilePath,(error, data) => {
    if (error) {
      // 处理错误
      console.error('发生错误:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // 将数据矩阵发送给前端
      res.json({ dataMatrix: data });
    }
  });
});

app.get('/api/data-matrix/get2', (req, res) => {
  // 调用readCSVFile函数获取数据
  const csvFilePath = './uploads/2.csv';
  readCSVFile(csvFilePath,(error, data) => {
    if (error) {
      // 处理错误
      console.error('发生错误:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // 将数据矩阵发送给前端
      res.json({ dataMatrix: data });
    }
  });
});

app.get('/api/data-matrix/steps', (req, res) => {
  // 调用readCSVFile函数获取数据
  const csvFilePath = './uploads/3.csv';
  readCSVFile(csvFilePath,(error, data) => {
    if (error) {
      // 处理错误
      console.error('发生错误:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // 将数据矩阵发送给前端
      res.json({ dataMatrix: data });
    }
  });
});

app.get('/api/data-matrix/rs', (req, res) => {
  try {
    // 执行命令
    const command = 'python3 ./test.py r_steps True > ./uploads/3.csv';
    execSync(command);

    res.send('命令执行成功！');
  } catch (error) {
    console.error(`执行命令时发生错误: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data-matrix/cs', (req, res) => {
  try {
    // 执行命令
    const command = 'python3 ./test.py c_steps True > ./uploads/3.csv';
    execSync(command);

    res.send('命令执行成功！');
  } catch (error) {
    console.error(`执行命令时发生错误: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data-matrix/srs', (req, res) => {
  try {
    // 执行命令
    const command = 'python3 ./test.py r_simpsteps True > ./uploads/3.csv';
    execSync(command);

    res.send('命令执行成功！');
  } catch (error) {
    console.error(`执行命令时发生错误: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data-matrix/scs', (req, res) => {
  try {
    // 执行命令
    const command = 'python3 ./test.py c_simpsteps True > ./uploads/3.csv';
    execSync(command);

    res.send('命令执行成功！');
  } catch (error) {
    console.error(`执行命令时发生错误: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data-matrix/gas', (req, res) => {
  try {
    // 执行命令
    const command = 'python3 ./test.py guassian True > ./uploads/3.csv';
    execSync(command);

    res.send('命令执行成功！');
  } catch (error) {
    console.error(`执行命令时发生错误: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data-matrix/inv', (req, res) => {
  try {
    // 执行命令
    const command = 'python3 ./test.py inverse True > ./uploads/3.csv';
    execSync(command);

    res.send('命令执行成功！');
  } catch (error) {
    console.error(`执行命令时发生错误: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data-matrix/lu', (req, res) => {
  try {
    // 执行命令
    const command = 'python3 ./test.py lu True > ./uploads/3.csv';
    execSync(command);

    res.send('命令执行成功！');
  } catch (error) {
    console.error(`执行命令时发生错误: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data-matrix/ldu', (req, res) => {
  try {
    // 执行命令
    const command = 'python3 ./test.py ldu True > ./uploads/3.csv';
    execSync(command);

    res.send('命令执行成功！');
  } catch (error) {
    console.error(`执行命令时发生错误: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data-matrix/crt', (req, res) => {
  try {
    // 执行命令
    const command = 'python3 ./test.py crout True > ./uploads/3.csv';
    execSync(command);

    res.send('命令执行成功！');
  } catch (error) {
    console.error(`执行命令时发生错误: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data-matrix/qr', (req, res) => {
  try {
    // 执行命令
    const command = 'python3 ./test.py qr True > ./uploads/3.csv';
    execSync(command);

    res.send('命令执行成功！');
  } catch (error) {
    console.error(`执行命令时发生错误: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data-matrix/adj', (req, res) => {
  try {
    // 执行命令
    const command = 'python3 ./test.py adjoint True > ./uploads/3.csv';
    execSync(command);

    res.send('命令执行成功！');
  } catch (error) {
    console.error(`执行命令时发生错误: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data-matrix/smt', (req, res) => {
  try {
    // 执行命令
    const command = 'python3 ./test.py schmidt True > ./uploads/3.csv';
    execSync(command);

    res.send('命令执行成功！');
  } catch (error) {
    console.error(`执行命令时发生错误: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data-matrix/egv', (req, res) => {
  try {
    // 执行命令
    const command = 'python3 ./test.py eigvals True > ./uploads/3.csv';
    execSync(command);

    res.send('命令执行成功！');
  } catch (error) {
    console.error(`执行命令时发生错误: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data-matrix/egm', (req, res) => {
  try {
    // 执行命令
    const command = 'python3 ./test.py eigmul True > ./uploads/3.csv';
    execSync(command);

    res.send('命令执行成功！');
  } catch (error) {
    console.error(`执行命令时发生错误: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

