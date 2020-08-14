import {post} from '../../request/index'

export default function login(userName,password) {
    return post("/login_auth",{username:userName,password})

}