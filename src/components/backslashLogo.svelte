
<script lang="ts">
    /* Copyright 2024 Yonatan Hattav
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License. */
    export let isExpanded = false;
    export let offsetColor = '255, 69, 0'; // Default to orange-red
    export let position = 'left'; // 'left' or 'right'

    $: angle = isExpanded ? 3 : 20; // Use 20 degrees when not expanded
    $: scale = isExpanded ? 6 : 1;
    $: strokeWidth = isExpanded ? 0.1 : 2; // Adjust stroke width based on expansion
</script>

<svg width="100%" height="100%" viewBox="-15 -15 30 30">
    <path
        d="M0 -10 L0 10"
        stroke="rgb({offsetColor})"
        stroke-width={strokeWidth}
        fill="none"
        transform="
            rotate({position === 'right' ? 180 + angle : angle})
            scale({scale} {scale})
        "
    />
</svg>

<style>
    svg {
        transition: all 0.3s ease;
    }
    path {
        transition: transform 0.3s ease, stroke-width 0.3s ease;
    }
</style>
