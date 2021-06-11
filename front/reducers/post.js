import shortId from 'shortid';

const initialState = {
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: 'bban',
      },
      content: '첫 번째 게시글 #해시태그 #익스프레스',
      Images: [
        {
          src: 'https://blogpfthumb-phinf.pstatic.net/MjAyMTA1MDNfMTYy/MDAxNjIwMDM5MjUwMTQw.GxxZWVGBsuMy8gGaWMa_oexuEkS9Xhrx-PXuh7uN5UEg.qjzjyTClwiLYwd1wwtgpenJK-k3dVqh1_f77S69un6Qg.JPEG.tombyun/chairman.jpeg?type=w161',
        },
        {
          src: 'https://blogpfthumb-phinf.pstatic.net/MjAyMTA1MDNfMTYy/MDAxNjIwMDM5MjUwMTQw.GxxZWVGBsuMy8gGaWMa_oexuEkS9Xhrx-PXuh7uN5UEg.qjzjyTClwiLYwd1wwtgpenJK-k3dVqh1_f77S69un6Qg.JPEG.tombyun/chairman.jpeg?type=w161',
        },
        {
          src: 'https://blogpfthumb-phinf.pstatic.net/MjAyMTA1MDNfMTYy/MDAxNjIwMDM5MjUwMTQw.GxxZWVGBsuMy8gGaWMa_oexuEkS9Xhrx-PXuh7uN5UEg.qjzjyTClwiLYwd1wwtgpenJK-k3dVqh1_f77S69un6Qg.JPEG.tombyun/chairman.jpeg?type=w161',
        },
      ],
      Comments: [
        {
          User: {
            id: 1,
            nickname: 'bban',
          },
          content: '멋져요~',
        },
        {
          User: {
            id: 2,
            nickname: 'anderson',
          },
          content: 'Yeah',
        },
      ],
    },
  ],
  imagePaths: [], // 이미지 업로드 경로
  addPostLoading: false,
  addPostDone: false, // 게시글 추가 완료 시 true로 변경
  addPostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostNull: null,
  addCommentLoading: false, // 댓글 추가 완료 시 true로 변경
  addCommentDone: false,
  addCommentError: null,
};

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const dummyPost = (data) => ({
  id: data.id,
  content: data.content,
  User: {
    id: 1,
    nickname: 'bban',
  },
  Images: [],
  Comments: [],
});

const dummyComment = (data) => ({
  User: {
    id: shortId.generate(),
    nickname: 'bban',
  },
  content: data,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_REQUEST:
      return {
        ...state,
        addPostLoading: true,
        addPostDone: false,
        addPostError: null,
      };
    case ADD_POST_SUCCESS:
      return {
        ...state,
        mainPosts: [dummyPost(action.data), ...state.mainPosts],
        addPostLoading: false,
        addPostDone: true,
      };
    case ADD_POST_FAILURE:
      return {
        ...state,
        removePostLoading: false,
        removePostError: action.error,
      };
    case REMOVE_POST_REQUEST:
      return {
        ...state,
        removePostLoading: true,
        removePostDone: false,
        removePostError: null,
      };
    case REMOVE_POST_SUCCESS:
      return {
        ...state,
        mainPosts: state.mainPosts.filter((v) => v.id !== action.data),
        removePostLoading: false,
        removePostDone: true,
      };
    case REMOVE_POST_FAILURE:
      return {
        ...state,
        addPostLoading: false,
        addPostError: action.error,
      };
    case ADD_COMMENT_REQUEST:
      return {
        ...state,
        addCommentLoading: true,
        addCommentDone: false,
        addCommentError: null,
      };
    case ADD_COMMENT_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(
        (v) => v.id === action.data.postId
      );
      const post = state.mainPosts[postIndex];
      const Comments = [dummyComment(action.data.content), ...post.Comments];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      return {
        ...state,
        mainPosts,
        // mainComments: [dummyComment, ...state.mainComments],
        addCommentLoading: false,
        addCommentDone: true,
      };
    }
    case ADD_COMMENT_FAILURE:
      return {
        ...state,
        addCommentLoading: false,
        addCommentError: action.error,
      };
    default:
      return state;
  }
};

export default reducer;
