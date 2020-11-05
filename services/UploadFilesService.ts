import axios from 'axios'

class UploadFilesService {
  upload (file: any, onUploadProgress: any) {
    console.log('upload...')
    const formData = new FormData()

    formData.append('file', file)

    // ?auth=" + vuexContext.state.token
    return axios.post(process.env.baseUrl + '/files.json', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    })
  }

  getFiles () {
    return axios.get(process.env.baseUrl + '/files.json')
  }
}

export default new UploadFilesService()
