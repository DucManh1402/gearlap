import { atom } from "recoil";

const orderState = atom({
    key: 'orderState',
    default: [],
});

export { orderState }

