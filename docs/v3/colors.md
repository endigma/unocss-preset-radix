<script setup>
  import { ref } from 'vue'
  import { RADIX_HUES } from "../../src/consts";
</script>

# Colors

<div class="">
  <div v-for="scale in RADIX_HUES">
    <div :class="`text-${scale}9 `">
      <h2 class="block mt-10">{{ scale }}</h2>
      <div class="flex gap-0.5">
        <span class="swatch min-w-15"></span>
        <div class="flex">
          <div v-for="i in 12">
            <div class="swatch w-10 text-center text-sage11">{{ i }}</div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-0.5">
        <div v-for="theme in ['dark', 'light']">
          <div class="flex flex-col gap-0.5" :class="`${theme}`">
            <div class="flex flex-row gap-0.5">
              <span class="swatch min-w-15 p-4 text-sage11">{{ theme }}</span>
              <div class="flex bg-gray1 p-1" style="grid-template-columns: repeat(12, 1fr)">
                <div v-for="i in 12">
                  <div
                    class="swatch w-10"
                    :class="`bg-${scale}${i} ${ i < 9 ? `text-${scale}12` : i < 11 ? `text-${scale}-fg` : `text-${scale}1` }`"
                  ></div>
                </div>
              </div>
            </div>
            <div class="flex flex-row gap-0.5" :class="`${theme}`">
              <span class="swatch min-w-15 p-4 text-sage11">alpha</span>
              <div class="flex bg-gray1 p-1" style="grid-template-columns: repeat(12, 1fr)">
                <div v-for="i in 12">
                  <div class="swatch w-10" :class="`bg-${scale}${i}A`"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .swatch {
    height: 2rem;
    padding: 5px;
  }
</style>
