<template>
  <li class="news-item">
    <span class="score">{{ score }}</span>
    <span class="title">
      <a :href="url" target="_blank">{{ title }}</a>
    </span>
    <br/>
    <span class="meta">
      <span class="by">
        by
        <a class="" :href="'/user/' + by">{{ by }}</a>
        | {{ descendants }} comments
      </span>
    </span>
  </li>
</template>

<script>
export default {
  name: 'Post',
  props: {
    score: {
      type: Number,
      required: false,
      default: 0,
    },
    url: {
      type: String,
      required: false,
      default: '#',
    },
    title: {
      type: String,
      required: false,
      default: 'undefined',
    },
    by: {
      type: String,
      required: false,
      default: 'undefined',
    },
    descendants: {
      type: Number,
      required: false,
      default: 0,
    },
  },
};
</script>
