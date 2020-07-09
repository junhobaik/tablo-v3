import { LocalStorageName } from "../modules/global/actions";

export default {
  getLoaclStorage: (name: LocalStorageName) => {
    return localStorage.getItem(name);
  },
  setLocalStorage: (name: LocalStorageName, data: any) => {
    let _data = data;

    if (typeof data !== "string") {
      _data = JSON.stringify(data);
    }

    localStorage.setItem(name, _data);
  },
};
