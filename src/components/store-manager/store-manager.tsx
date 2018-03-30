// import { Component, State } from '@stencil/core';

// @Component({
//     tag: 'store-manager'
// })
// export class StoreManager {
//     @State() store;

//     constructor() { }

//     create(value) {
//         this.store.dispatch({ type: 'CREATE', payload: { id: Date.now(), value: value } });
//     }

//     delete(id) {
//         this.store.dispatch({ type: 'DELETE', payload: { id: id } });
//     }

//     update(id, value) {
//         this.store.dispatch({ type: 'UPDATE', payload: { id: id, value: value } });
//     }

//     setStore(store) {
//         this.store = store;
//     }
// }