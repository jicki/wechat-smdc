import axios from 'axios'

// 上传文件
export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  return axios.post('/api/file/upload', formData)
}

// 删除文件
export function deleteFile(filePath) {
  return axios.post('/api/file/delete', null, {
    params: {
      filePath
    }
  })
} 