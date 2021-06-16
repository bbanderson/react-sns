import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Popover, Avatar, Button, Card, Comment, List } from 'antd';
import {
  RetweetOutlined,
  HeartOutlined,
  MessageOutlined,
  EllipsisOutlined,
  HeartTwoTone,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import FollowButton from './FollowButton';
import {
  LIKE_POST_REQUEST,
  REMOVE_POST_REQUEST,
  RETWEET_REQUEST,
  UNLIKE_POST_REQUEST,
} from '../reducers/post';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { removePostLoading } = useSelector((state) => state.post);
  const id = me?.id; // 로그인을 했다면 id가 있을 것임.
  const [commentFormOpened, setCommentFormOpened] = useState(false);

  const onLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({ type: LIKE_POST_REQUEST, data: post.id });
  }, [id]);
  const onUnlike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({ type: UNLIKE_POST_REQUEST, data: post.id });
  }, [id]);
  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    dispatch({ type: REMOVE_POST_REQUEST, data: post.id });
  }, [id]);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({ type: RETWEET_REQUEST, data: post.id });
  }, [id]);
  const liked = post.Likers.find((v) => v.id === id);

  return (
    <div>
      <Card
        cover={
          post.Images && post.Images[0] && <PostImages images={post.Images} />
        }
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked ? (
            <HeartTwoTone
              key="heart"
              twoToneColor="#eb2f96"
              onClick={onUnlike}
            />
          ) : (
            <HeartOutlined key="heart" onClick={onLike} />
          ),
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <Button.Group>
                {id && id === post.User.id ? (
                  <>
                    <Button type="primary">수정</Button>
                    <Button
                      type="danger"
                      loading={removePostLoading}
                      onClick={onRemovePost}
                    >
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={
          post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : ''
        }
        extra={me && <FollowButton post={post} />}
      >
        {post.RetweetId && post.Retweet ? (
          <Card
            cover={
              post.Retweet.Images &&
              post.Retweet.Images[0] && (
                <PostImages images={post.Retweet.Images} />
              )
            }
          >
            <Card.Meta
              avatar={
                <Link href={`/user/${post.Retweet.User.id}`}>
                  <a>
                    <Avatar>{post.Retweet.User?.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.Retweet.User?.nickname}
              description={<PostCardContent postData={post?.Retweet.content} />}
            />
          </Card>
        ) : (
          <Card.Meta
            avatar={
              <Link href={`/user/${post.User.id}`}>
                <a>
                  <Avatar>{post.User?.nickname[0]}</Avatar>
                </a>
              </Link>
            }
            title={post.User?.nickname}
            description={<PostCardContent postData={post?.content} />}
          />
        )}
        {/* <Content /> */}
        {/* <Buttons></Buttons> */}
      </Card>
      {commentFormOpened && (
        <div>
          <CommentForm post={post} />
          {/* post : 댓글이 어느 포스트에 속하는지 알리기 위한 props */}
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={
                    <Link href={`/user/${item.User.id}`}>
                      <a>
                        <Avatar>{item.User.nickname[0]}</Avatar>
                      </a>
                    </Link>
                  }
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
