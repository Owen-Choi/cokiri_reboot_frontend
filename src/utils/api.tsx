import axios, {AxiosRequestConfig} from 'axios';
import {history} from "../index";
import {setToken} from "../store/jwtTokenReducer";

let store;


//이렇게 store을 index파일에서 주입해주는 식으로 하면 순환오류를 막을수있다.
//배포 확인
//https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
export const injectStore = _store => {
    store = _store;
}

const Api = axios.create({
    // baseURL: "https://f3f-cokiri.site/",
    baseURL: process.env.REACT_APP_BACKEND_LOCAL_URL,
});

const base = process.env.REACT_APP_BACKEND_LOCAL_URL;

const sourceRequest: any = {};

//accessToken을 header에 넣어준다
Api.interceptors.request.use(
    (config) => {
        // HTTP Authorization 요청 헤더에 jwt-token을 넣음
        // 서버측 미들웨어에서 이를 확인하고 검증한 후 해당 API에 요청함.
        const accessToken = store.getState().jwtTokenReducer.accessToken;

        try {
            if (!accessToken) {
                config.headers["Authorization"] = null;
            } else if (config.headers && accessToken) {
                config.headers["Authorization"] = `Bearer ${accessToken}`;
            }

        } catch (err) {
            console.error('[_axios.interceptors.request] config : ' + err);
        }
        return config;
    },

    (error) => {
        // 요청 에러 직전 호출됩니다.
        return Promise.reject(error);
    }
);

Api.interceptors.response.use(
    //200번 (성공) 범위에 있는 상태 코드는 이 함수에서 트리거 된다
    function (response) {
        console.warn(`${response.config.method.toUpperCase()} ${response.request.responseURL} 으로 요청 성공 : ${response.status}`);
        console.log(response);
        return response;
    },
    //200번이 아닌 응답 오류 작업 핸들링
    async function (err) {
        const { config, response: { status } } = err;
        console.error(`${err.response.config.method.toUpperCase()} ${err.response.request.responseURL} 으로 요청 실패 : ${err.response.status} 
        ${err.response.data.message}`);
        //accessToken이 만료가 돼서 401이 떴을때
        if (err.response && err.response.status === 401) {
            switch (err.response.status) {
                case 401: {
                    const accessToken = store.getState().jwtTokenReducer.accessToken;
                    const jsonObj = {"accessToken": accessToken};
                    if (accessToken) {
                        try {
                            const data = await axios.post(base + "/auth/reissue", jsonObj);
                            const jwtToken = data.data.accessToken;
                            if (jwtToken) {
                                store.dispatch(setToken(data.data));
                                config.headers.Authorization = `Bearer ${jwtToken}`;
                                console.log(axios(config));
                                return axios(config);
                            }
                        }
                        catch (err) {
                            console.log("나중에 이부분확인")
                            console.log(err);
                            console.log("refreshToken이 만료돼서 accesToken을 재발급할수없음")
                            history.push('/login');
                        }
                    } else { //로그인 되지 않은 상태일때
                        alert("로그인이 필요한 작업입니다")
                        return new Promise(() => {});
                    }
                }

                case 404: {
                    return new Promise(() => {
                    });
                }

                case 409: {
                    return new Promise(() => {
                    });
                }

            }

            console.log(err)
            return Promise.reject(err);
        }
        console.log(err)
        return Promise.reject(err);
    }
);

export default Api;