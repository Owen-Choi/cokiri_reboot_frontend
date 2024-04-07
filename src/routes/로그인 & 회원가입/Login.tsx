import React, {useCallback, useState} from 'react';
import styles from "../../styles/loginAndSignup/Login.module.scss"
import loginImg from "../../img/cokkiriLogo.png"
import {useNavigate} from "react-router-dom";
import TextInput from "../../component/common/TextInput";
import Button from "../../component/common/Button";
import {useDispatch, useSelector} from "react-redux";
import {setToken} from "../../store/jwtTokenReducer";
import {Rootstate} from "../../index";
import {setOnelineIntro, setPW, setUserInfo,} from "../../store/userInfoReducer";
import {
    parcelAddress1,
    parcelAddress2,
    setAddressName1,
    setAddressName2,
    setLat1,
    setLat2,
    setLng1,
    setLng2,
    setUserAddressInfo1,
    setUserAddressInfo2
} from "../../store/userAddressInfoReducer";
import axios from "axios";

const Login = () => {
    //성공기원
    const store = useSelector((state:Rootstate) => state);
    const dispatch = useDispatch();

    const [isOpenModal, setOpenModal] = useState<boolean>(false);

    const onClickToggleModal = useCallback(() => {
        setOpenModal(!isOpenModal);
    }, [isOpenModal]);

    const [email,setEmail] = useState('');
    const [google,setGoogle] = useState('');
    interface UserInfo {
        email: string;
        password: string;
    }

    const [passwordCheck, setpasswordCheck] = useState<boolean>(undefined);
    const [userInfo, setuserInfo] = useState<UserInfo>(null);
    const [postResult, setPostResult] = useState(null);
    const navigate = useNavigate();
    const base = process.env.REACT_APP_BACKEND_LOCAL_URL;

    const signInClick = () => {
        navigate(`/signup`)
    }


    const onChangeEmail = (e) => {
        setuserInfo((prevState) => {
            return {...prevState, email: e.target.value}
        })
    }

    const onChangePassword = (e) => {
        setuserInfo((prevState) => {
            return {...prevState, password: e.target.value}
        })
        dispatch(setPW(e.target.value))
    }
    async function postLoginData() {
            //interceptor를 사용한 방식 (header에 token값 전달)
        try{
            // 로그인 시에는 Api, 즉 interceptor를 사용하면 안된다. accessToken과 refreshToken이 모두 만료되면
            // 무한 루프에 빠진다.
            const res = await axios.post(base + '/login',userInfo);
            console.log(res)
            const accessToken = res.data;
            //jwt 토큰 redux에 넣기
            const jwtToken = accessToken.tokenInfo;
            dispatch(setToken(jwtToken));
            dispatch(setUserInfo(res.data.userInfo.userDetail))
            dispatch(setOnelineIntro(res.data.userInfo.userDetail.description))
            if(res.data.userInfo.address[0]!=null){
                dispatch(setUserAddressInfo1(res.data.userInfo.address[0].id))
                dispatch(setAddressName1(res.data.userInfo.address[0].addressName))
                dispatch(parcelAddress1(res.data.userInfo.address[0].postalAddress))
                dispatch(setLat1(res.data.userInfo.address[0].latitude))
                dispatch(setLng1(res.data.userInfo.address[0].longitude))
            }
            if(res.data.userInfo.address[1]!=null){
                dispatch(setUserAddressInfo2(res.data.userInfo.address[1].id))
                dispatch(setAddressName2(res.data.userInfo.address[1].addressName))
                dispatch(parcelAddress2(res.data.userInfo.address[1].postalAddress))
                dispatch(setLat2(res.data.userInfo.address[1].latitude))
                dispatch(setLng2(res.data.userInfo.address[1].longitude))
            }

            console.log("store",store)
            alert("로그인 성공")
            console.log("비밀번호",store.userInfoReducer.password)
            navigate(`/`)
            }
            catch (err)
            {
                console.log(err)
                alert("로그인에 실패하였습니다." + `\n` +
                    "아이디 혹은 비밀번호를 다시 확인해주세요")
            }
    }
    const handleClick= () => {
        console.log(userInfo);
        postLoginData();
    }

    const findId = () => {
        navigate(`/findid`)
    }

    const findPw = () => {
        navigate('/findpw')
    }


    return (
        <><div className={styles.box}>
            <div className={styles.loginAllContent}>
                <section className={styles.header}>
                    <img src={loginImg} className={styles.loginImg}></img>
                    <h1>코끼리로 물물교환 시작하기</h1>
                    <h2>간편하게 가입하고 우리동네 물건들을 확인하세요</h2>
                </section>
                <section className={styles.contents}>
                    <div className={styles.loginContents}>
                        <fieldset>
                            <div className={styles.idAndPassword}>
                                <TextInput type={"text"} placeholder={"코끼리 ID(이메일)을 입력해주세요."} onBlur={onChangeEmail}/>
                            <div className={styles.password}>
                                <TextInput type={"password"} placeholder={"비밀번호를 입력해주세요."} onBlur={onChangePassword}/>

                            </div>

                            </div>
                            <div className={styles.savedIdCheck}>
                                <label><input type="checkbox"/>  로그인 상태 유지</label>
                            </div>
                                <Button className={"black"} onClick={handleClick} content={"코끼리 로그인"}/>
                        </fieldset>
                    </div>
                    <div className={styles.loginMenu}>
                        <span className={styles.signup} onClick={signInClick}>회원가입</span>
                        <span className={styles.findId} onClick={findId}>ID 찾기</span>
                        <span className={styles.findPw} onClick={findPw}>비밀번호 찾기</span>
                    </div>
                </section>
                {/*<Button className={"white"} onClick={()=>{  onClickToggleModal(); }} content={"구글 로그인"}/>*/}
                {/*@ts-ignore*/}
                {/*<Button className={"white"} onClick={googleLogin} content={"구글 로그인"}/>*/}
            </div>
        </div>
        </>
    );
}
//

export default Login;