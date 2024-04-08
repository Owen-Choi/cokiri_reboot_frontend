import React, {useEffect, useState} from 'react';
import styles from "../styles/loginAndSignup/MyPage.module.css"
import {useLocation, useNavigate} from "react-router-dom";
import Card from "../component/tradeCard/Card";
import Api from "../utils/api";

interface PostType {
    content: [
        {
            postId?: number;
            title?: string;
            thumbNail?: string,
            scrapCount: number,
            tradeStatus: string,
            wishCategory?: string;
        }
    ]
}

const MyPageZZIM = () => {
    const [tab1, setTab] = useState('curr');
    const [scrapList, setScrapList] = useState<PostType[]>(null)
    const {state} = useLocation(); //다른 유저꺼 받을 때

    function setDealTab(tab) {
        setTab(tab)
        console.log("zzim 페이지")
        console.log(tab1)
    }

    const navigate = useNavigate();

    async function getMySrapPostList() {
        try {
            const res = await Api.get('/user/scrap');
            console.log("내 게시글들임", res.data.content[0])
            setScrapList(prevState => {
                return [...res.data.content];
            })
        } catch (err) {
            console.log(err)
            alert("내 스크랩 불러오기 실패");
        }
    }

    useEffect(() => {
        getMySrapPostList();
    }, [])
    if (!scrapList) {
        return null
    }
    const onClickPost = (post) => {
        navigate(`/post/${post.postId}`)
    }
    console.log("찜 페이지로 state", state)
    return (
        <>
            <div className={styles.MyPage}>
                <div className={styles.container}>
                    {
                        scrapList.reverse().map((SingleObject: Object) => (
                            <Card className={"forMypage"} postTitle={SingleObject['title']}
                                  like={SingleObject['scrapCount']} wishCategory={SingleObject['wishCategory']}
                                  thumbnail={SingleObject['thumbNail']}
                                  onClick={() => {
                                      onClickPost(SingleObject)
                                  }}/>
                        ))
                    }
                </div>
            </div>
        </>
    );
}

export default MyPageZZIM;