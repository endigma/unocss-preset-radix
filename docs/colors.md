<script setup>
import { ref } from 'vue'
import { radixColors } from "../src";
</script>

# Colors

<div v-for="scale in radixColors">
	<div :class="`hue-${scale} text-hue9`">
		<h2 class="block mt-10">{{ scale }}</h2>
		<div class="flex flex-row gap-0.5">
			<span class="swatch p-4"></span>
			<div v-for="i in 12">
				<div class="swatch text-center text-sage11">{{ i }}</div>
			</div>
		</div>
		<div class="flex flex-col gap-0.5">
      <div v-for="theme in ['dark', 'light']">
        <div class="flex flex-col gap-0.5">
          <div class="flex flex-row gap-0.5">
            <span class="swatch p-4 text-sage11">{{ theme }}</span>
            <div class="flex flex-row gap-0.5" :class="`${theme}-theme`">
              <div v-for="i in 12">
                <div
                  class="swatch"
                  :class="`bg-hue${i} ${ i < 9 ? 'text-hue12' : 'text-hue-fg' }`"
                >
                  fg
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-0.5">
            <span class="swatch p-4 text-sage11">alpha</span>
            <div class="flex flex-row gap-0.5" :class="`${theme}`">
              <div v-for="i in 12">
                <div class="swatch" :class="`bg-hue${i}A`"></div>
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
		width: 3rem;
		height: 2rem;
		padding: 5px;
	}
</style>
