const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const multer = require('multer')
const { Client } = require('@elastic/elasticsearch')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'zxcv0987@',
  database: 'my_db',
})

db.connect((err) => {
  if (err) {
    console.error('❌ DB 연결 실패:', err)
  } else {
    console.log('✅ MySQL 연결 성공!')
  }
})

//이거 이제 테스트 끝나서 지워도 될듯듯
// local 5000화면면
app.get('/', (req, res) => {
  res.send('백엔드 서버 작동 중!')
})

app.get('/api/hello', (req, res) => {
  res.json({ message: '서버 정상 연결 테스트ing' })
})

app.get('/api/messages', (req, res) => {
  const sql = 'SELECT * FROM messages'
  db.query(sql, (err, results) => {
    if (err) {
      console.error('DB 쿼리 에러:', err)
      res.status(500).json({ error: 'DB 오류 발생' })
    } else {
      res.json(results)
    }
  })
})

const esClient = new Client({
  node: 'http://localhost:9200',
})

// multer를 사용하여 파일 저장
const upload = multer({ dest: 'uploads/' })

// 파일 업로드 및 Elasticsearch에 저장
app.post('/api/upload', upload.single('logfile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' })
  }

  const filePath = path.join(__dirname, req.file.path)
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n')

  // Elasticsearch에 데이터 저장
  try {
    for (const line of lines) {
      if (line.trim() === '') continue // 공백 줄 무시
      await esClient.index({
        index: 'logs', // 로그 데이터가 저장될 인덱스 이름
        document: {
          message: line, // 로그 메시지
          timestamp: new Date().toISOString(),
        },
      })
    }

    // Elasticsearch에 데이터 저장 후 간단한 분석 결과 리턴
    const result = await esClient.count({ index: 'logs' })
    res.json({
      totalLogs: result.count, // 현재 Elasticsearch에 저장된 총 로그 수
      message: '파일 업로드 및 분석 성공!',
    })
  } catch (err) {
    console.error('Elasticsearch 인덱스 오류:', err)
    res.status(500).json({ message: '서버 오류 발생' })
  } finally {
    fs.unlinkSync(filePath)
  }
})

// 서버 실행 콘솔창
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`)
})
