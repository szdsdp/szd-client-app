//view->actions->mutations->state->view  view通过dispatch提交到actions，actions通过commit提交到mutations，并最终修改state中的数据
import { getWhiteList } from "../api/login";

const vuexData = {
  state: {
    dict: {}, //数据字典
    group: {}, //数据组
    whiteList: []
  },
  mutations: {
    SET_DICT: (state, data) => {
      state.dict[data.baseField] = data.options;
    },
    SET_GROUP: (state, obj) => {
      state.group[obj.key] = obj.value;
    },
    DEL_GROUP: (state, key) => {
      delete state.group[key];
    },
    SET_WHITELIST: (state, data) => {
      state.whiteList = data && data.length > 0 ? data : ["/login"];
      if (!state.whiteList.includes("/login")) state.whiteList.push("/login");
    }
  },
  actions: {
    //设置数据字典
    setVuexDataDict({ commit }, data) {
      commit("SET_DICT", data);
    },
    //设置数据组
    setVuexDataGroup({ commit }, data) {
      commit("SET_GROUP", data);
    },
    //删除数据组
    delVuexDataGroup({ commit }, data) {
      commit("DEL_GROUP", data);
    },
    //设置白名单
    setVuexDataWhiteList({ commit, state }) {
      return new Promise(resolve => {
        if (state.whiteList && state.whiteList.length > 0) {
          resolve(true);
        } else {
          getWhiteList()
            .then(res => {
              if (res && res.code === 200 && res.data) {
                commit("SET_WHITELIST", res.data);
              } else {
                commit("SET_WHITELIST", null);
              }
              resolve(true);
            })
            .catch(() => {
              commit("SET_WHITELIST", null);
              resolve(true);
            });
        }
      });
    }
  }
};

export default vuexData;
