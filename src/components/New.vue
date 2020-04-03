<template>
  <div class="container news-list">
    <ul>
      <li v-for="post in posts" class="news-item" :key="post.id">
        <span class="score">{{ post.score }}</span>
        <span class="title">
          <a :href="post.url" target="_blank">{{ post.title }}</a>
        </span>
        <br/>
        <span class="meta">
          <span class="by">
            by
            <a class="" :href="'/user/' + post.by">{{ post.by }}</a>
             | {{ post.descendants }} comments
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
const baseURL = 'https://hacker-news.firebaseio.com';
const postsLimit = 15;

export default {
  data() {
    return {
      posts: [],
    };
  },
  created() {
    if (this.newPosts.length < postsLimit) {
      this.fetchPosts();
    } else {
      this.posts = this.newPosts;
    }
  },
  methods: {
    fetchPosts() {
      const uri = `${baseURL}/v0/newstories.json?print=pretty`;

      this.axios.get(uri).then((response) => {
        for (let i = 0; i < postsLimit; i += 1) {
          const postUri = `${baseURL}/v0/item/${response.data[i]}.json?print=pretty`;

          this.axios.get(postUri).then((postRes) => {
            // Get a clone of the post (to prevent re-fetching of data).
            this.newPosts.push({ ...postRes.data });

            // Then push it to posts (since vue will change it).
            this.posts.push(postRes.data);
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
a {
  text-decoration: none;
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
</style>
