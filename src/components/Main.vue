 <template>
  <div id="main">
    <!-- 测试效果,暂不删-->
    <p style="font-size: 20px">你好，克扣可乐</p>
    <p>5555555555555555555555</p>
    <p>5555555555555555555555</p>
    <p>5555555555555555555555</p>
    <p>5555555555555555555555</p>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const feature = ref();

    return {};
  },
};
</script>
<style scoped>
p {
  height: 500px;
}
#main {
  width: 100%;
  height: calc(100% - 150px);
  overflow: auto;
}
</style>
