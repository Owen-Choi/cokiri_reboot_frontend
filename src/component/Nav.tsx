import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/nav/nav.module.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import myImage from '../img/cokkiriLogo.png';
import mypage from '../img/mypage.png';
import talk from '../img/talk.png';
import { Rootstate } from '../index';
import { useDispatch, useSelector } from 'react-redux';
import Tags from '@yaireo/tagify/dist/react.tagify';
// import Tags from '@yaireo/tagify/dist/tagify.min';
import { changePostRefreshState } from '../store/refreshReducer';
import { BsSearch } from 'react-icons/bs';

const Nav1 = () => {

    const store = useSelector((state: Rootstate) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [tagSearch, setTagSearch] = useState<string[]>()
    const info = useSelector((state: Rootstate) => {
        return state.userInfoReducer
    })


    const onChange = useCallback((e) => {

        const tagifyCleanValue = e.detail.tagify.getCleanValue()

        let tagList = tagifyCleanValue.reduce((prev, cur) => {
            prev.push(cur.value)
            return prev;
        }, []);


        setTagSearch((prevState) => {
            return tagList
        })

    }, [])


    const onClickSearch = () => {
        const tagString = tagSearch.join();
        //태그 검색 post container refresh
        dispatch(changePostRefreshState());
        // console.log(store.refreshReducer.postChange);
        navigate(`/tagsearch?tags=${tagString}`);

    }

    const settings = {
        // maxTags : 3,
        delimiters: ",|\n|\r"
        // pattern : /^.{0,9}$/,
    }


    return (
      <div className={styles.navBarBar}>
          <Navbar className={styles.navBar} bg="white" variant="white">
              <div className={styles.logoBox}>
                  <img className={styles.homeLogo} onClick={() => navigate('/')} src={myImage} />
                  <p className={styles.logoText} onClick={() => navigate('/')}>COKIRI</p>
              </div>
              <Nav className={styles.meauto}>
                  <div className={styles.menu1}>
                      <Nav.Link className={styles.mulBtn} onClick={() => navigate('/mulmultrade')}>물물교환</Nav.Link>
                      <Nav.Link className={styles.kiriBtn} onClick={() => navigate('/kirikiritrade')}>끼리끼리</Nav.Link>
                  </div>

                  {/*<form className={styles.searchBox}>*/}
                  {/*<input className={styles.search} type="search" placeholder=" #해시태그를 검색하세요!" aria-disabled="true"/>*/}
                  <div className={styles.tagDiv}>
                      <Tags
                        className={styles.customLook}
                        placeholder="해시태그를 적고 엔터를 눌러주세요."
                        settings={settings}
                        //여기서 자동완성을 설정할수있음, 추후에 서버에서 tag 리스트를 가져와서 넣으면 될듯
                        whitelist={["스팸", "식품", "과일존맛", "신상품", "스팸클래식", "이게자동완성이라는건데요"]}
                        // defaultValue="a,b,c"
                        onChange={onChange}
                      />
                      <button className={styles.search} onClick={onClickSearch}><BsSearch
                        className={styles.searchIcon} /></button>
                  </div>
                  <div className={styles.right}>
                      <div>
                          <div className={styles.loginAndImage}>
                              <img className={styles.mypageI} onClick={() => navigate('/')}
                                   src={store.jwtTokenReducer.authenticated ? mypage : mypage} />
                              {(store.jwtTokenReducer.authenticated ?
                                // {store.userInfoReducer.nickname}
                                <Nav.Link className={styles.signBtn2} onClick={() => navigate(`/mypage/${info.id}`)}>내
                                    상점</Nav.Link>
                                :
                                <Nav.Link className={styles.signBtn}
                                          onClick={() => navigate('/login')}>로그인/회원가입</Nav.Link>)
                              }
                          </div>
                      </div>
                      <div className={styles.talkDiv}>
                          <img className={styles.mypageI2} onClick={() => navigate('/')} src={talk} />
                          <Nav.Link className={styles.signBtn} onClick={() => navigate(`/kokiriTalk/${info.id}`)}>코끼리
                              톡</Nav.Link>
                      </div>
                  </div>
              </Nav>

          </Navbar>
      </div>

    );
};

export default Nav1;