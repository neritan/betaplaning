import axios from 'axios'
export const getAll = (url) => {
    return new Promise((resolve, reject) => {
        axios.get(url).then(res => resolve(res.data))
        .catch(err => reject(err));
      })
}

export const getById = (url) => {
    return new Promise((resolve, reject) => {
        axios.get(url).then(res => resolve(res.data))
        .catch(err => reject(err));
      })
}

export const create = (url, payload) => {
    return new Promise((resolve, reject) => {
        axios.post(url, payload).then(res => resolve(res.data))
        .catch(err => reject(err));
    })
} 

//export const update =