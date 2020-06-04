<template>
  <div class="main">
    <div class="bg" width="1280" height="720" id="main">
    </div>
    <div class="jumbotron">
        <h1>Welcome to Color War</h1>
        <form @submit.passive="login">
            <input v-model="name" type="text" placeholder="your name here .." autofocus required>
        </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      name: ''
    }
  },
  methods: {
    login () {
      localStorage.setItem('username', this.name)
      this.$router.push('/rooms')
    }
  }
}
</script>

<style>
.main {
  height: 100vh;
}
.bg{
  width: 100%;
  height: 100%;
  background-image: url('../assets/color.gif');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  z-index: -1;
}

.jumbotron {
  background-color: rgba(236, 240, 241,.5);
  padding: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.jumbotron h1 {
  text-shadow: 5px 5px 3px white;
  font-size: 4rem;
}
.jumbotron form {
  box-shadow: 5px 5px 3px white;
}
</style>
