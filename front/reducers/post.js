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
            nickname: 'anderson',
          },
          content: 'Yeah',
        },
      ],
    },
  ],
  imagePaths: [], // 이미지 업로드 경로
  postAdded: false, // 게시글 추가 완료 시 true로 변경
};

const ADD_POST = 'ADD_POST';
export const addPost = {
  type: ADD_POST,
};

const dummyPost = {
  id: 2,
  content: '더미 데이터',
  User: {
    id: 1,
    nickname: 'bban',
  },
  Images: [],
  Comments: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts],
        postAdded: true,
      };
    default:
      return state;
  }
};

export default reducer;
