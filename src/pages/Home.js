import { useEffect, useState } from 'react'
import './home.css'

function Home() {
  const [file, setFile] = useState(null)

  /*const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }*/

  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/hello')
      .then((res) => res.json())
      .then((data) => setMsg(data.message))
      .catch((err) => console.error('서버 연결 에러:', err))
  }, [])

  //파일 첨부 & 연결되라 ㅈㅂㅂ
  const [fileContent, setFileContent] = useState('')

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    setFile(selectedFile)

    const reader = new FileReader()
    reader.onload = (e) => {
      setFileContent(e.target.result)
    }
    reader.readAsText(selectedFile)
  }

  //서버로 내용보낼때때
  const handleUpload = async () => {
    if (!file) return alert('파일을 먼저 선택해 주세요.')

    const formData = new FormData()
    formData.append('logfile', file)

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      console.log('분석 결과:', data)
      // 필요한 경우 분석 결과를 상태로 저장하고 표시할 수 있음
    } catch (err) {
      console.error('파일 업로드 실패:', err)
    }
  }

  return (
    <div className="main">
      <h1 className="title">무료 AI 로그 분석</h1>
      {/*<p>서버 응답: {msg}</p>*/}
      <div className="divider"></div>

      <label className="upload-box">
        <input type="file" className="file-input" onChange={handleFileChange} />
        <span className="upload-text">파일을 업로드해 주세요.</span>
      </label>
      {file && <p className="file-name">선택한 파일: {file.name}</p>}

      <div className="preview-box">
        <h3>파일 미리보기</h3>
        <pre>{fileContent.split('\n').slice(0, 10).join('\n')}</pre>
      </div>
      <button onClick={handleUpload} className="upload-button">
        서버에 업로드 및 분석 요청
      </button>
    </div>
  )
}

export default Home
