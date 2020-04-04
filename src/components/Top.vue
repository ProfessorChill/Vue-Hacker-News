<template>
  <div class="container news-list">
    <div class="news-list-nav">
      <a v-on:click="getPage(page - 1)" href="#"
         v-if="this.page - 1 > 0">&lt; prev</a>
      <a class="disabled" v-if="this.page - 1 < 1">&lt; prev</a>
      <span>{{ this.page }} / {{ Math.ceil(this.topPostIds.length / this.postsLimit) }}</span>
      <a v-on:click="getPage(page + 1)" href="#">more &gt;</a>
    </div>

    <ul>
      <Post v-for="post in posts"
        :score="post.score"
        :title="post.title"
        :url="post.url"
        :by="post.by"
        :descendants="post.descendants"
        :key="post.id" />
    </ul>
    <button @click="reload">Reset</button><br/>
  </div>
</template>

<script>
import Post from './Post.vue';

const baseURL = 'https://hacker-news.firebaseio.com';
const postsLimit = 15;

export default {
  data() {
    return {
      posts: [],
      postIds: [],
      page: this.$route.params.pageNum ? Number(this.$route.params.pageNum) : 1,
      postsLimit,
    };
  },
  components: {
    Post,
  },
  created() {
    if (this.topPosts.length < postsLimit) {
      this.$store.clearAll();
      this.fetchPosts();
    } else {
      this.posts = this.topPosts;
      this.postIds = this.topPostIds;
    }
  },
  methods: {
    fetchPosts() {
      const uri = `${baseURL}/v0/topstories.json`;

      this.axios.get(uri).then((response) => {
        for (let i = 0; i < response.data.length; i += 1) {
          this.topPostIds.push(response.data[i]);
        }
        this.postIds = this.topPostIds;

        for (let i = 0; i < postsLimit; i += 1) {
          const postUri = `${baseURL}/v0/item/${response.data[i]}.json`;

          this.axios.get(postUri).then((postRes) => {
            // Get a clone of the post (to prevent re-fetching of data).
            this.topPosts.push({ ...postRes.data });

            // Then push it to posts (since vue will change it).
            this.posts.push(postRes.data);
          });
        }
      });
    },
    getPage(pageNum) {
      this.posts = [];

      // Clear the persistant data.
      this.$store.topPosts = [];
      this.topPosts = [];

      const top = pageNum * this.postsLimit;
      for (let i = (pageNum - 1) * this.postsLimit; i < top; i += 1) {
        const postUri = `${baseURL}/v0/item/${this.postIds[i]}.json`;

        this.axios.get(postUri).then((postRes) => {
          this.topPosts.push({ ...postRes.data });

          this.posts.push(postRes.data);
        });
      }

      this.page = pageNum;
    },
    reload() {
      // Used for debugging.
      this.$store.clearAll();

      window.location.reload();
    },
  },
};
</script>

<style lang="scss">
a {
  text-decoration: none;
}

.disabled {
  cursor: default;
  color: #ccc;
}

.news-item {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  line-height: 20px;
  padding: 20px 30px 20px 80px;
  position: relative;

  .score {
    color: #f60;
    font-size: 1.1em;
    font-weight: 700;
    left: 0;
    margin-top: -10px;
    position: absolute;
    text-align: center;
    top: 50%;
    width: 80px;
  }

  .meta {
    color: #828282;
    font-size: .85em;

    a {
      color: #828282;
      text-decoration: underline;
    }
  }
}

.news-list {
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
}

.news-list-nav {
  padding: 15px 30px;
  text-align: center;

  a {
    margin: 0 1em;
  }
}
</style>
