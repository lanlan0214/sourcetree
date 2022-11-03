const { createApp, reactive } = Vue;

/**
 * * Create Vue3 Instance
 * @author Nathan Cheng
 * @date   10/16/2022 16:54:25
 */
createApp({
  setup() {
    /**
     * * Vue3 Binding Data
     * @author Nathan Cheng
     * @date   10/16/2022 16:53:39
     */
    return {
      accountInfo: reactive({
        id: '',
        password: ''
      })
    };
  },
  methods: {
    /**
     * * Vue3 Methods
     * @author Nathan Cheng
     * @date   10/16/2022 16:53:39
     */
    tryLogin() {
      const { id, password } = this.accountInfo;
      alert(`id: ${id}\npw: ${password}`);
    },
    forgetPassword() {
      // do whatever you want
    }
  }
}).mount('#app');
