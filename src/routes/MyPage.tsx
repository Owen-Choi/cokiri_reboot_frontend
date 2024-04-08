import React, { useEffect, useState } from 'react';
import styles from '../styles/loginAndSignup/MyPage.module.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Card from '../component/tradeCard/Card';
import Api from '../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { Rootstate } from '../index';

// interface TextInputProps {
//     init: string;
// }
interface PostType {
  content: [
    {
      postId?: number;
      title?: string;
      thumbNail?: string,
      likeCount: number,
      tradeStatus: string,
      wishCategory?: string;
    }
  ];
}

const MyPage = () => {
  const [tab1, setTab] = useState<string>('curr');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation(); //다른 유저꺼 받을 때

  const params = useParams();
  // console.log(params)
  let paramsId = parseInt(params.id);
  const [otherPost, setOtherPostList] = useState(null);

  const detail = useSelector((state: Rootstate) => {
    return state.postDetailReducer;
  });
  const info = useSelector((state: Rootstate) => {
    return state.userInfoReducer;
  });
  const store = useSelector((state: Rootstate) => state);
  const [postList, setPostList] = useState<PostType[]>(null);

  function setDealTab(tab) {
    setTab(tab);
  }


  async function getMyPostList() {
    try {
      const res = await Api.get('/user/posts');
      console.log('내 게시글들임', res.data.content[0]);
      setPostList(prevState => {
        return [...res.data.content];
      });
    } catch (err) {
      console.log(err);
      alert('내 게시글 불러오기 실패');
    }
  }

  async function getUserPost_2() {
    try {
      const res = await Api.get(`/post/user/${paramsId}`);
      console.log('다른 유저 게시글 정보', res);
      setOtherPostList(prevState => {
        return [...res.data.content];
      });

    } catch (err) {
      console.log(err);
      alert('실패인가');
    }
  }

  //TODO: 의성) state로 하는게 아니라 useParams 로 하는거임 /289 뒤에 id를 검증해야지

  useEffect(() => {
    if (paramsId === info.id) {
      getMyPostList();
    }
  }, []);
  useEffect(() => {
    if (paramsId != info.id) {
      getUserPost_2();
    }
  }, []);

  // getMyPostList();

  if (paramsId === info.id) {
    if (!postList) {
      return null;
    }
  }

  if (paramsId != info.id) {
    if (!otherPost) {
      return null;
    }
  }


  const onClickPost = (post) => {
    navigate(`/post/${post.postId}`);
  };

  return (
    <div className={styles.wrap}>

      <div className={styles.MyPage}>
        <div className={styles.container}>
          {
            paramsId === info.id ?
              postList.reverse().map((SingleObject: Object) => (
                <Card className={'forMypage'} postTitle={SingleObject['title']}
                      like={SingleObject['likeCount']} wishCategory={SingleObject['wishCategory']}
                      thumbnail={SingleObject['thumbNail']}
                      onClick={() => {
                        onClickPost(SingleObject);
                      }} />
              )) :
              otherPost.reverse().map((SingleObject: Object) => (
                <Card className={'forMypage'} postTitle={SingleObject['title']}
                      like={SingleObject['likeCount']} wishCategory={SingleObject['wishCategory']}
                      thumbnail={SingleObject['thumbNail']}
                      onClick={() => {
                        onClickPost(SingleObject);
                      }} />
              ))
          }
        </div>
      </div>
    </div>

  );
};

export default MyPage;