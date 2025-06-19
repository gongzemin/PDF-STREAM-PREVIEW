const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const port = 3000

app.use(express.static('public'))

// 提供 PDF 文件流
app.get('/pdf', (req, res) => {
  const filePath = path.join(__dirname, 'sample.pdf')
  const stat = fs.statSync(filePath)

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Length', stat.size)

  const readStream = fs.createReadStream(filePath)
  readStream.pipe(res)
})

app.get('/docx', (req, res) => {
  const filePath = path.join(__dirname, '健身房小程序安装使用手册.docx')
  const stat = fs.statSync(filePath)

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
  res.setHeader('Content-Length', stat.size)

  const readStream = fs.createReadStream(filePath)
  readStream.pipe(res)
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
